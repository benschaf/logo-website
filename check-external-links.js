#!/usr/bin/env node

/**
 * External Links Security Checker
 * 
 * This script validates that all external links with target="_blank" 
 * include proper rel="noopener noreferrer" attributes for security.
 * 
 * Usage:
 *   node check-external-links.js [--fix] [file1.html file2.html ...]
 * 
 * Options:
 *   --fix    Automatically fix missing rel attributes
 *   --help   Show this help message
 */

const fs = require('fs');
const path = require('path');

class ExternalLinksChecker {
  constructor() {
    this.issues = [];
    this.fixMode = false;
  }

  /**
   * Check if a URL is external (not a fragment or relative path)
   */
  isExternalUrl(href) {
    return href.startsWith('http://') || 
           href.startsWith('https://') || 
           href.startsWith('//');
  }

  /**
   * Parse HTML and find all anchor tags with target="_blank"
   */
  findTargetBlankLinks(htmlContent, filename) {
    const linkRegex = /<a[^>]*target\s*=\s*["']_blank["'][^>]*>/gi;
    const matches = [];
    let match;

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const linkTag = match[0];
      const startIndex = match.index;
      
      // Extract href attribute
      const hrefMatch = linkTag.match(/href\s*=\s*["']([^"']+)["']/i);
      const href = hrefMatch ? hrefMatch[1] : null;
      
      // Check if it has rel attribute
      const relMatch = linkTag.match(/rel\s*=\s*["']([^"']+)["']/i);
      const rel = relMatch ? relMatch[1] : null;
      
      // Calculate line number
      const beforeMatch = htmlContent.substring(0, startIndex);
      const lineNumber = beforeMatch.split('\n').length;
      
      matches.push({
        tag: linkTag,
        href,
        rel,
        lineNumber,
        startIndex,
        endIndex: startIndex + linkTag.length
      });
    }

    return matches;
  }

  /**
   * Check if rel attribute contains required security values
   */
  hasSecureRel(rel) {
    if (!rel) return false;
    
    const relValues = rel.toLowerCase().split(/\s+/);
    return relValues.includes('noopener') && relValues.includes('noreferrer');
  }

  /**
   * Generate a secure rel attribute
   */
  generateSecureRel(existingRel) {
    if (!existingRel) {
      return 'noopener noreferrer';
    }
    
    const relValues = existingRel.toLowerCase().split(/\s+/);
    const newValues = [...relValues];
    
    if (!newValues.includes('noopener')) {
      newValues.push('noopener');
    }
    
    if (!newValues.includes('noreferrer')) {
      newValues.push('noreferrer');
    }
    
    return newValues.join(' ');
  }

  /**
   * Fix a single link by adding or updating the rel attribute
   */
  fixLink(linkInfo, htmlContent) {
    const { tag, rel, startIndex, endIndex } = linkInfo;
    
    if (this.hasSecureRel(rel)) {
      return htmlContent; // Already secure
    }
    
    let newTag;
    
    if (rel) {
      // Update existing rel attribute
      const secureRel = this.generateSecureRel(rel);
      newTag = tag.replace(/rel\s*=\s*["'][^"']*["']/i, `rel="${secureRel}"`);
    } else {
      // Add new rel attribute
      const insertPosition = tag.indexOf('target="_blank"') + 'target="_blank"'.length;
      newTag = tag.slice(0, insertPosition) + ' rel="noopener noreferrer"' + tag.slice(insertPosition);
    }
    
    return htmlContent.slice(0, startIndex) + newTag + htmlContent.slice(endIndex);
  }

  /**
   * Check a single HTML file
   */
  checkFile(filename) {
    try {
      const htmlContent = fs.readFileSync(filename, 'utf8');
      const links = this.findTargetBlankLinks(htmlContent, filename);
      
      let updatedContent = htmlContent;
      let fileIssues = [];
      let hasChanges = false;
      
      // Process links in reverse order to maintain correct indices when fixing
      for (let i = links.length - 1; i >= 0; i--) {
        const link = links[i];
        
        // Only check external links
        if (link.href && this.isExternalUrl(link.href)) {
          if (!this.hasSecureRel(link.rel)) {
            const issue = {
              file: filename,
              line: link.lineNumber,
              href: link.href,
              currentRel: link.rel || '(none)',
              severity: 'HIGH',
              message: 'External link with target="_blank" missing secure rel attribute'
            };
            
            fileIssues.push(issue);
            
            if (this.fixMode) {
              updatedContent = this.fixLink(link, updatedContent);
              hasChanges = true;
              issue.status = 'FIXED';
            }
          }
        }
      }
      
      // Write back the fixed content
      if (this.fixMode && hasChanges) {
        fs.writeFileSync(filename, updatedContent);
        console.log(`✅ Fixed ${fileIssues.length} issues in ${filename}`);
      }
      
      this.issues.push(...fileIssues);
      
      return {
        filename,
        issues: fileIssues,
        fixed: this.fixMode && hasChanges
      };
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}: ${error.message}`);
      return {
        filename,
        error: error.message,
        issues: []
      };
    }
  }

  /**
   * Generate a report of all issues found
   */
  generateReport() {
    const highIssues = this.issues.filter(issue => issue.severity === 'HIGH');
    
    console.log('\n' + '='.repeat(60));
    console.log('EXTERNAL LINKS SECURITY REPORT');
    console.log('='.repeat(60));
    
    if (highIssues.length === 0) {
      console.log('✅ All external links are properly secured!');
      console.log('   All target="_blank" links have rel="noopener noreferrer"');
    } else {
      console.log(`❌ Found ${highIssues.length} security issue(s):`);
      console.log();
      
      highIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.file}:${issue.line}`);
        console.log(`   URL: ${issue.href}`);
        console.log(`   Current rel: ${issue.currentRel}`);
        console.log(`   Status: ${issue.status || 'NEEDS FIX'}`);
        console.log(`   Issue: ${issue.message}`);
        console.log();
      });
      
      if (!this.fixMode) {
        console.log('💡 Run with --fix flag to automatically resolve these issues');
      }
    }
    
    console.log('='.repeat(60));
    
    return highIssues.length === 0;
  }

  /**
   * Main execution method
   */
  run(args) {
    const options = this.parseArgs(args);
    
    if (options.help) {
      this.showHelp();
      return;
    }
    
    this.fixMode = options.fix;
    const filesToCheck = options.files.length > 0 ? options.files : this.findHtmlFiles();
    
    console.log('🔍 Checking external links security...');
    if (this.fixMode) {
      console.log('🔧 Fix mode enabled - issues will be automatically resolved');
    }
    console.log();
    
    const results = filesToCheck.map(file => this.checkFile(file));
    
    // Show per-file summary
    results.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.filename}: Error - ${result.error}`);
      } else if (result.issues.length === 0) {
        console.log(`✅ ${result.filename}: No issues found`);
      } else {
        const status = result.fixed ? 'Fixed' : 'Found';
        console.log(`⚠️  ${result.filename}: ${status} ${result.issues.length} issue(s)`);
      }
    });
    
    const allClear = this.generateReport();
    
    // Exit with appropriate code for CI/CD
    if (!allClear && !this.fixMode) {
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments
   */
  parseArgs(args) {
    const options = {
      fix: false,
      help: false,
      files: []
    };
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--fix') {
        options.fix = true;
      } else if (arg === '--help' || arg === '-h') {
        options.help = true;
      } else if (arg.endsWith('.html')) {
        options.files.push(arg);
      }
    }
    
    return options;
  }

  /**
   * Find all HTML files in the current directory
   */
  findHtmlFiles() {
    try {
      return fs.readdirSync('.')
        .filter(file => file.endsWith('.html'))
        .sort();
    } catch (error) {
      console.error('Error finding HTML files:', error.message);
      return [];
    }
  }

  /**
   * Show help message
   */
  showHelp() {
    console.log(`
External Links Security Checker

This script validates that all external links with target="_blank" 
include proper rel="noopener noreferrer" attributes for security.

Usage:
  node check-external-links.js [options] [files...]

Options:
  --fix     Automatically fix missing rel attributes
  --help    Show this help message

Examples:
  node check-external-links.js                    # Check all HTML files
  node check-external-links.js index.html         # Check specific file
  node check-external-links.js --fix              # Check and fix all files
  node check-external-links.js --fix index.html   # Check and fix specific file

Security Details:
  External links with target="_blank" can be a security vulnerability
  if they don't include rel="noopener noreferrer":
  
  - "noopener" prevents the new page from accessing window.opener
  - "noreferrer" prevents the new page from knowing the referring URL
  
  This protects against reverse tabnabbing attacks and privacy leaks.
`);
  }
}

// Run the checker if this script is executed directly
if (require.main === module) {
  const checker = new ExternalLinksChecker();
  checker.run(process.argv.slice(2));
}

module.exports = ExternalLinksChecker;