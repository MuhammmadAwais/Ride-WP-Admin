# Ride With Pals — Mobile App (Flutter) CMS Rendering Guide

> **Companion Target:** `Ride-WP` Mobile Application (Flutter)  
> **Source App:** `Ride-WP-Admin` Control Center  
> **Target Pages:** Privacy Policy (`privacy_policy`), Terms & Conditions (`terms_conditions`), About Us (`about`)  
> **Objective:** Deliver the exact same executive-grade typographic hierarchy, high-energy biker aesthetic, and clean document structure in the Flutter mobile application as rendered in the Admin Control Center.

---

## 🤖 Instructions for AI Agent

If you are an AI assistant receiving this document to implement CMS page rendering in the **Ride-WP Flutter app**:
1. Implement the provided Dart data models ([`CMSBlock`](#1-data-models-cms_modelsdart)).
2. Implement the parsing algorithm ([`CMSDocumentParser`](#2-parsing-engine-cms_document_parserdart)) to convert the raw backend content string into structured blocks.
3. Build the Flutter widgets ([`CMSBlockItem`](#3-block-widget-renderer-cms_block_widgetdart) & [`CMSContentScreen`](#4-full-screen-implementation-cms_content_screendart)) following the **exact Ride-WP design tokens** specified below.
4. Do not display raw unstyled text or generic markdown without theme tokens. Follow the high-energy biker theme (Dark Charcoal `#202020`/`#282828`, Biker Orange `#EB712B`, Poppins for titles, Roboto for body).

---

## 1. Backend API Specification

The mobile app accesses CMS documents through the public, unauthenticated endpoint:

### Endpoint Details
- **Method:** `GET`
- **URL:** `https://api.ridewithpals.com/api/public/content/{key}`
- **Keys:**
  - `privacy_policy` → Privacy Policy
  - `terms_conditions` → Terms and Conditions of Use
  - `about` → About Us / Organization Story
- **Headers:**
  - `Accept: application/json`
  - `language: en` or `es` (optional, defaults to `en`)

### Response Envelope
```json
{
  "statusCode": 200,
  "message": "Content fetched successfully.",
  "response": {
    "key": "privacy_policy",
    "title": "Privacy Policy",
    "content": "# PRIVACY POLICY\n\n• Controller\n\nController: Next Pals, S.L., CIF B93792000, C/ Miguel Asín y Palacios, 40, 8.º D, 50009 Zaragoza, Spain.\nPrivacy and rights email: admin@ridewithpals.com. Website: www.ridewithpals.com.\n\n• Data processed\n\nDepending on use of the Platform...",
    "titleEs": "Política de Privacidad",
    "contentEs": "...",
    "createdAt": "2026-08-21T12:44:38.000Z",
    "updatedAt": "2026-09-25T13:07:34.000Z"
  }
}
```

---

## 2. Design System & Tokens (Ride-WP)

| Token Name | Dark Mode (Default) | Light Mode | Flutter Value / Style |
|---|---|---|---|
| **Accent Orange** | `#EB712B` | `#EB712B` | `const Color(0xFFEB712B)` |
| **Canvas Background** | `#202020` | `#F6F6F6` | `const Color(0xFF202020)` / `const Color(0xFFF6F6F6)` |
| **Surface / Card** | `#282828` | `#FFFFFF` | `const Color(0xFF282828)` / `Colors.white` |
| **Text Main** | `#FFFFFF` | `#363636` | `const Color(0xFFFFFFFF)` / `const Color(0xFF363636)` |
| **Text Muted** | `#95908D` | `#6B6B6B` | `const Color(0xFF95908D)` / `const Color(0xFF6B6B6B)` |
| **Border Color** | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` | `Colors.white.withOpacity(0.08)` |
| **Title Font** | **Poppins** | **Poppins** | `GoogleFonts.poppins(...)` |
| **Body Font** | **Roboto** | **Roboto** | `GoogleFonts.roboto(...)` |

---

## 3. Typographic Hierarchy & Layout Rules

1. **Main Headings (`H1`):**
   - Font: `Poppins`, `FontWeight.w700`, size `20-22sp`, `textMain`.
   - Bottom border line with `0.8 opacity`.
   - Spacing: `24dp` top margin, `8dp` bottom padding.
2. **Subheadings (`H2` / Section Titles):**
   - In the backend data, section titles often start with `• Acceptance`, `• Controller`, `• Data processed`.
   - The parser strips the `•` bullet and identifies them as **Subheadings**.
   - Render with a **signature vertical orange accent indicator pill**:
     `Container(width: 4, height: 18, decoration: BoxDecoration(color: accentColor, borderRadius: BorderRadius.circular(2)))`.
   - Font: `Poppins`, `FontWeight.w600`, size `16-17sp`, `textMain`.
   - Spacing: `20dp` top margin, `8dp` bottom padding.
3. **Paragraphs:**
   - Font: `Roboto`, `FontWeight.w400`, size `14.5sp`, height `1.65`, `textMuted`.
   - Preserves line breaks (`\n`), allowing multi-line metadata (such as the company address and contact email) to sit on distinct lines.
   - Spacing: `6dp` vertical margin.
4. **Bullet Lists:**
   - Real multi-item lists are rendered with a custom circular accent bullet:
     `Container(width: 5, height: 5, decoration: BoxDecoration(color: accentColor, shape: BoxShape.circle))`.
   - Spacing: `6dp` between list items.

---

## 4. Production Dart Implementation

### 1. Data Models (`cms_models.dart`)

```dart
enum CMSBlockType { heading, subheading, paragraph, list }

class CMSBlock {
  final String id;
  final CMSBlockType type;
  final dynamic content; // String for heading/subheading/paragraph, List<String> for list

  CMSBlock({
    required this.id,
    required this.type,
    required this.content,
  });
}

class CMSContentResponse {
  final String key;
  final String title;
  final String content;
  final String? titleEs;
  final String? contentEs;
  final String? updatedAt;

  CMSContentResponse({
    required this.key,
    required this.title,
    required this.content,
    this.titleEs,
    this.contentEs,
    this.updatedAt,
  });

  factory CMSContentResponse.fromJson(Map<String, dynamic> json) {
    return CMSContentResponse(
      key: json['key'] as String? ?? '',
      title: json['title'] as String? ?? '',
      content: json['content'] as String? ?? '',
      titleEs: json['titleEs'] as String?,
      contentEs: json['contentEs'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );
  }
}
```

---

### 2. Parsing Engine (`cms_document_parser.dart`)

This parser matches the algorithm used in the web Admin Control Center:

```dart
import 'cms_models.dart';

class CMSDocumentParser {
  static final RegExp _markdownHeadingRe = RegExp(r'^(#{1,6})\s+(.+)$');
  static final RegExp _bulletRe = RegExp(
    r'^[-*•›–—▪▸○●]\s+(.+)$|^\d{1,3}[.)]\s+(.+)$|^[a-zA-Z][.)]\s+(.+)$',
  );

  static List<CMSBlock> parseTextToBlocks(String raw) {
    if (raw.trim().isEmpty) return [];

    final lines = raw
        .replaceAll('\r\n', '\n')
        .replaceAll('\r', '\n')
        .split('\n');

    final List<CMSBlock> blocks = [];
    List<String> pendingBullets = [];
    List<String> paragraphLines = [];

    void flushBullets() {
      if (pendingBullets.isNotEmpty) {
        blocks.add(CMSBlock(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          type: CMSBlockType.list,
          content: List<String>.from(pendingBullets),
        ));
        pendingBullets.clear();
      }
    }

    void flushParagraph() {
      if (paragraphLines.isEmpty) return;
      var text = paragraphLines.join('\n').trim();
      if (text.isNotEmpty) {
        // Intelligently format contact attribution lines onto separate lines
        text = text.replaceAllMapped(
          RegExp(r'\.\s+(Privacy and rights email:|Email:|Website:|Contact:)', caseSensitive: false),
          (match) => '.\n${match.group(1)}',
        );
        blocks.add(CMSBlock(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          type: CMSBlockType.paragraph,
          content: text,
        ));
      }
      paragraphLines.clear();
    }

    String? getNextNonEmptyLine(int startIndex) {
      for (int j = startIndex + 1; j < lines.length; j++) {
        final l = lines[j].trim();
        if (l.isNotEmpty) return l;
      }
      return null;
    }

    String? extractBulletText(String line) {
      final match = _bulletRe.firstMatch(line);
      if (match == null) return null;
      return (match.group(1) ?? match.group(2) ?? match.group(3) ?? '').trim();
    }

    bool isAllCapsHeading(String line) {
      if (line.isEmpty || line.length > 80) return false;
      if (!RegExp(r'[A-Z]').hasMatch(line)) return false;
      if (line.endsWith('.') || line.endsWith(',')) return false;
      return line == line.toUpperCase();
    }

    bool isColonHeading(String line) {
      if (!line.endsWith(':') || line.length > 60) return false;
      final words = line.split(RegExp(r'\s+'));
      return words.length <= 7;
    }

    for (int i = 0; i < lines.length; i++) {
      final line = lines[i].trim();

      // Empty line → flush
      if (line.isEmpty) {
        flushParagraph();
        flushBullets();
        continue;
      }

      // 1. Markdown heading (# H1, ##/### H2/H3)
      final mdMatch = _markdownHeadingRe.firstMatch(line);
      if (mdMatch != null) {
        flushParagraph();
        flushBullets();
        final hashes = mdMatch.group(1)!.length;
        final content = mdMatch.group(2)!.trim();
        blocks.add(CMSBlock(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          type: hashes == 1 ? CMSBlockType.heading : CMSBlockType.subheading,
          content: content,
        ));
        continue;
      }

      // 2. ALL CAPS line (e.g. PRIVACY POLICY)
      if (isAllCapsHeading(line)) {
        flushParagraph();
        flushBullets();
        blocks.add(CMSBlock(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          type: CMSBlockType.heading,
          content: line,
        ));
        continue;
      }

      // 3. Colon label (e.g. "Data Processed:")
      if (isColonHeading(line)) {
        flushParagraph();
        flushBullets();
        blocks.add(CMSBlock(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          type: CMSBlockType.subheading,
          content: line.substring(0, line.length - 1),
        ));
        continue;
      }

      // 4. Bullet lines with isolated title heuristic
      final bulletText = extractBulletText(line);
      if (bulletText != null) {
        final isAlreadyInList = pendingBullets.isNotEmpty;
        final nextLine = getNextNonEmptyLine(i);
        final isNextLineBullet = nextLine != null && extractBulletText(nextLine) != null;

        final isIsolatedTitle = !isAlreadyInList &&
            !isNextLineBullet &&
            bulletText.length <= 75 &&
            !bulletText.endsWith('.') &&
            !bulletText.endsWith(';') &&
            !bulletText.endsWith(',');

        if (isIsolatedTitle) {
          flushParagraph();
          flushBullets();
          blocks.add(CMSBlock(
            id: DateTime.now().microsecondsSinceEpoch.toString(),
            type: CMSBlockType.subheading,
            content: bulletText,
          ));
          continue;
        }

        // Multi-item list
        flushParagraph();
        pendingBullets.add(bulletText);
        continue;
      }

      // 5. Standard paragraph text
      flushBullets();
      paragraphLines.add(line);
    }

    flushParagraph();
    flushBullets();

    return blocks;
  }
}
```

---

### 3. Block Widget Renderer (`cms_block_widget.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'cms_models.dart';

class CMSBlockWidget extends StatelessWidget {
  final CMSBlock block;
  final bool isDarkMode;

  const CMSBlockWidget({
    super.key,
    required this.block,
    this.isDarkMode = true,
  });

  static const Color accentColor = Color(0xFFEB712B);

  @override
  Widget build(BuildContext context) {
    final textMainColor = isDarkMode ? Colors.white : const Color(0xFF363636);
    final textMutedColor = isDarkMode ? const Color(0xFF95908D) : const Color(0xFF6B6B6B);
    final borderColor = isDarkMode ? Colors.white.withOpacity(0.08) : Colors.black.withOpacity(0.08);

    switch (block.type) {
      case CMSBlockType.heading:
        return Padding(
          padding: const EdgeInsets.only(top: 24.0, bottom: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                block.content as String,
                style: GoogleFonts.poppins(
                  fontSize: 20.0,
                  fontWeight: FontWeight.w700,
                  color: textMainColor,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 8.0),
              Container(
                height: 1.0,
                width: double.infinity,
                color: borderColor,
              ),
            ],
          ),
        );

      case CMSBlockType.subheading:
        return Padding(
          padding: const EdgeInsets.only(top: 20.0, bottom: 6.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 4.0,
                height: 18.0,
                decoration: BoxDecoration(
                  color: accentColor,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 10.0),
              Expanded(
                child: Text(
                  block.content as String,
                  style: GoogleFonts.poppins(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w600,
                    color: textMainColor,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
            ],
          ),
        );

      case CMSBlockType.paragraph:
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Text(
            block.content as String,
            style: GoogleFonts.roboto(
              fontSize: 14.5,
              fontWeight: FontWeight.w400,
              height: 1.65,
              color: textMutedColor,
            ),
          ),
        );

      case CMSBlockType.list:
        final items = (block.content is List)
            ? (block.content as List).cast<String>()
            : [block.content.toString()];

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 6.0),
          child: Column(
            children: items.map((item) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 8.0, right: 10.0),
                      width: 5.0,
                      height: 5.0,
                      decoration: const BoxDecoration(
                        color: accentColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        item,
                        style: GoogleFonts.roboto(
                          fontSize: 14.5,
                          height: 1.55,
                          color: textMutedColor,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        );
    }
  }
}
```

---

### 4. Full Screen Implementation (`cms_content_screen.dart`)

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'cms_models.dart';
import 'cms_document_parser.dart';
import 'cms_block_widget.dart';

class CMSContentScreen extends StatefulWidget {
  final String contentKey; // 'privacy_policy' | 'terms_conditions' | 'about'
  final String fallbackTitle;

  const CMSContentScreen({
    super.key,
    required this.contentKey,
    required this.fallbackTitle,
  });

  @override
  State<CMSContentScreen> createState() => _CMSContentScreenState();
}

class _CMSContentScreenState extends State<CMSContentScreen> {
  late Future<List<CMSBlock>> _blocksFuture;
  String _pageTitle = '';

  @override
  void initState() {
    super.initState();
    _pageTitle = widget.fallbackTitle;
    _blocksFuture = _fetchAndParseCMSContent();
  }

  Future<List<CMSBlock>> _fetchAndParseCMSContent() async {
    final url = Uri.parse('https://api.ridewithpals.com/api/public/content/${widget.contentKey}');
    final response = await http.get(url, headers: {'Accept': 'application/json'});

    if (response.statusCode == 200) {
      final jsonMap = json.decode(response.body) as Map<String, dynamic>;
      final responseData = jsonMap['response'] as Map<String, dynamic>?;

      if (responseData != null) {
        final title = responseData['title'] as String? ?? widget.fallbackTitle;
        final rawContent = responseData['content'] as String? ?? '';

        if (mounted) {
          setState(() {
            _pageTitle = title;
          });
        }

        return CMSDocumentParser.parseTextToBlocks(rawContent);
      }
    }

    throw Exception('Failed to load ${widget.fallbackTitle}');
  }

  @override
  Widget build(BuildContext context) {
    const isDarkMode = true; // Match Ride-WP theme mode
    const backgroundColor = Color(0xFF202020);
    const cardColor = Color(0xFF282828);
    const accentColor = Color(0xFFEB712B);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          _pageTitle,
          style: GoogleFonts.poppins(
            fontSize: 17,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
      body: FutureBuilder<List<CMSBlock>>(
        future: _blocksFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: accentColor),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, color: Colors.redAccent, size: 40),
                    const SizedBox(height: 12),
                    Text(
                      'Failed to load ${_pageTitle.toLowerCase()}.',
                      style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: accentColor,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        setState(() {
                          _blocksFuture = _fetchAndParseCMSContent();
                        });
                      },
                      child: Text('Retry', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ),
            );
          }

          final blocks = snapshot.data ?? [];

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(24.0),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: blocks.map((block) {
                  return CMSBlockWidget(block: block, isDarkMode: isDarkMode);
                }).toList(),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 5. Summary of Solved Visual Edge Cases

1. **Isolated Bullet Titles Solved:**
   Lines formatted as `• Controller` or `• Acceptance` are no longer displayed as isolated orange dots hovering over blank gaps. The parser strips the `•` and elevates them into high-contrast section subheadings with an orange vertical anchor pill.
2. **Controller Two-Line Wrap:**
   Attribution and contact clauses (`...Spain. Privacy and rights email:...`) are automatically rendered as two distinct lines, maintaining clean legal presentation.
3. **Responsive Width & Spacing:**
   Card padding, line-height (`1.65`), and section breaks (`20dp`) prevent visual cramping on small mobile screens and prevent excessive stretching on tablets.
