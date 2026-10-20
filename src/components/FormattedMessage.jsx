import React from 'react';
import { ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Tokenize and parse inline markdown formatting (bold, italic, code, links, strikethrough).
 * Guarantees zero raw technical symbols like `**`, `*`, `__`, or backticks are displayed.
 */
function parseInline(text, { isUser = false, isDark = false } = {}) {
  if (!text) return null;

  let sanitized = text;

  // Auto-balance unclosed ** during streaming
  const boldMatches = sanitized.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    sanitized += '**';
  }

  // Auto-balance unclosed backticks during streaming
  const codeMatches = sanitized.match(/`/g);
  if (codeMatches && codeMatches.length % 2 !== 0) {
    sanitized += '`';
  }

  // Match: code `...`, bold **...**, bold __...__, links [...](...), italic *...*, italic _..._, strikethrough ~~...~~
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/g;
  const parts = sanitized.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`font-mono text-[11px] px-1.5 py-0.5 rounded transition-colors ${
            isUser
              ? 'bg-white/20 text-white font-semibold'
              : isDark
              ? 'bg-slate-900 border border-slate-700 text-purple-300 font-semibold'
              : 'bg-purple-50 text-xperience-purple border border-purple-200/60 font-semibold'
          }`}
        >
          {code}
        </code>
      );
    }

    // 2. Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-bold ${
            isUser
              ? 'text-white'
              : isDark
              ? 'text-white font-extrabold'
              : 'text-slate-900 font-bold'
          }`}
        >
          {boldText}
        </strong>
      );
    }

    // 3. Link: [title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-bold transition-colors ${
            isUser
              ? 'text-white hover:text-purple-100'
              : isDark
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-xperience-purple hover:text-purple-800'
          }`}
        >
          {linkMatch[1]}
        </a>
      );
    }

    // 4. Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2 && !part.startsWith('__'))
    ) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="italic opacity-90 font-medium">
          {italicText}
        </em>
      );
    }

    // 5. Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      const delText = part.slice(2, -2);
      return (
        <del key={index} className="line-through opacity-60">
          {delText}
        </del>
      );
    }

    // 6. Regular text: strip any accidental remaining raw markdown markers like lone ** or ##
    const cleanText = part
      .replace(/^#{1,6}\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/__/g, '');

    return <span key={index}>{cleanText}</span>;
  });
}

/**
 * FormattedMessage Component
 * Converts markdown headers (##, ###, #), bold (**), bullet lists (-), numbered lists (1.),
 * quotes (>), and code blocks into an executive, user-friendly, structured UI.
 */
export default function FormattedMessage({ content, isUser = false, isDark = false, onClearChat = null }) {
  if (!content) return null;

  // Extract special action tokens
  const speakUpMatch = content.match(/\[SPEAK_UP_ACTION:\s*([^\|\]]+)(?:\s*\|\s*([^\]]+))?\]/);
  const gapMatch = content.match(/\[KNOWLEDGE_GAP:\s*([^\]]+)\]/);

  // Clean the content of action tokens
  const cleanContent = content
    .replace(/\[SPEAK_UP_ACTION:[^\]]+\]/g, '')
    .replace(/\[KNOWLEDGE_GAP:[^\]]+\]/g, '')
    .trim();

  // Split into code fence blocks vs standard markdown text
  const blocks = cleanContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-1.5 text-xs leading-relaxed ${isUser ? 'text-white' : isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      {/* 1. Speak Up Confirmation Card if detected */}
      {speakUpMatch && (
        <div className={`p-3.5 rounded-2xl border text-xs space-y-2 mb-2 animate-fadeIn ${
          isDark 
            ? 'bg-amber-950/40 border-amber-600/50 text-amber-200' 
            : 'bg-amber-50/90 border-amber-300 text-amber-900 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Confidential Speak Up Logged Anonymously</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-95">
            Your report has been submitted directly to People Operations and Executive Leadership under category <strong className="underline">{(speakUpMatch[1] || 'General Feedback').trim()}</strong>. Zero user identification or IP address was recorded, and this conversation is completely untraceable.
          </p>
        </div>
      )}

      {/* 2. Knowledge Gap Notification Card if detected */}
      {gapMatch && (
        <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 mb-2 animate-fadeIn ${
          isDark 
            ? 'bg-purple-950/40 border-purple-600/50 text-purple-200' 
            : 'bg-purple-50/90 border-purple-200 text-purple-950 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xperience-purple">
            <Sparkles className="w-4 h-4 text-xperience-purple shrink-0" />
            <span>Query Raised to HR • Knowledge Base Update Pending</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-95">
            This topic is not currently covered in our official company policies. We have automatically escalated this question to our HR / People Operations team so they can review and add this policy.
          </p>
        </div>
      )}
      {blocks.map((block, blockIdx) => {
        if (!block) return null;

        // Fenced Code Block
        if (block.startsWith('```') && block.endsWith('```')) {
          const codeLines = block.split('\n');
          const firstLine = codeLines[0].replace('```', '').trim();
          const language = firstLine || 'code';
          const codeContent = codeLines.slice(1, -1).join('\n') || codeLines.slice(1).join('\n').replace(/```$/, '');

          return (
            <div
              key={blockIdx}
              className="my-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-b border-slate-800/80 text-[10px] font-mono text-slate-400">
                <span>{language}</span>
              </div>
              <pre className="p-3 text-[11px] font-mono overflow-x-auto leading-normal">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Standard Markdown lines
        const lines = block.split('\n');

        return (
          <React.Fragment key={blockIdx}>
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              // Empty spacer line
              if (!trimmed) {
                // Return a compact spacer so paragraphs breathe naturally
                return <div key={lineIdx} className="h-1.5" />;
              }

              const isArabic = /[\u0600-\u06FF]/.test(trimmed);
              const alignClass = isArabic ? 'text-right' : 'text-left';
              const dirAttr = isArabic ? 'rtl' : 'ltr';

              // Heading 1: # Title
              const h1Match = trimmed.match(/^#\s+(.*)$/);
              if (h1Match) {
                return (
                  <h3
                    key={lineIdx}
                    dir={dirAttr}
                    className={`text-sm sm:text-base font-extrabold tracking-tight mt-3 mb-1.5 pb-1 border-b ${
                      isUser
                        ? 'text-white border-white/20'
                        : isDark
                        ? 'text-purple-300 border-purple-900/50'
                        : 'text-slate-900 border-purple-100'
                    } ${alignClass}`}
                  >
                    {parseInline(h1Match[1], { isUser, isDark })}
                  </h3>
                );
              }

              // Heading 2: ## Title or ##Title
              const h2Match = trimmed.match(/^##\s*(.*)$/);
              if (h2Match) {
                return (
                  <h4
                    key={lineIdx}
                    dir={dirAttr}
                    className={`text-xs sm:text-sm font-bold tracking-tight mt-2.5 mb-1 flex items-center gap-1.5 ${
                      isUser
                        ? 'text-white'
                        : isDark
                        ? 'text-purple-300'
                        : 'text-xperience-purple'
                    } ${alignClass}`}
                  >
                    {!isUser && (
                      <span className="w-1.5 h-3.5 rounded-full bg-gradient-to-b from-[#6C47C9] to-[#9366EE] shrink-0" />
                    )}
                    <span>{parseInline(h2Match[1], { isUser, isDark })}</span>
                  </h4>
                );
              }

              // Heading 3: ### Title or ###Title
              const h3Match = trimmed.match(/^###\s*(.*)$/);
              if (h3Match) {
                return (
                  <h5
                    key={lineIdx}
                    dir={dirAttr}
                    className={`text-xs font-bold mt-2 mb-0.5 ${
                      isUser
                        ? 'text-white/95'
                        : isDark
                        ? 'text-slate-100'
                        : 'text-slate-800'
                    } ${alignClass}`}
                  >
                    {parseInline(h3Match[1], { isUser, isDark })}
                  </h5>
                );
              }

              // Heading 4+: #### Title
              const h4Match = trimmed.match(/^####+\s*(.*)$/);
              if (h4Match) {
                return (
                  <h6
                    key={lineIdx}
                    dir={dirAttr}
                    className={`text-[11px] font-bold uppercase tracking-wider mt-1.5 mb-0.5 ${
                      isUser
                        ? 'text-white/80'
                        : isDark
                        ? 'text-purple-400'
                        : 'text-slate-600'
                    } ${alignClass}`}
                  >
                    {parseInline(h4Match[1], { isUser, isDark })}
                  </h6>
                );
              }

              // Horizontal Rule: ---, ***, ___
              if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
                return (
                  <hr
                    key={lineIdx}
                    className={`my-2 border-t ${
                      isUser
                        ? 'border-white/20'
                        : isDark
                        ? 'border-slate-800'
                        : 'border-slate-200'
                    }`}
                  />
                );
              }

              // Blockquote / Tip / Note: > text
              const quoteMatch = trimmed.match(/^>\s*(.*)$/);
              if (quoteMatch) {
                return (
                  <blockquote
                    key={lineIdx}
                    dir={dirAttr}
                    className={`border-l-3 px-3 py-1.5 my-1.5 rounded-r-xl text-xs italic ${
                      isUser
                        ? 'border-white bg-white/10 text-white'
                        : isDark
                        ? 'border-purple-500 bg-purple-950/40 text-purple-200'
                        : 'border-xperience-purple bg-purple-50/60 text-slate-700'
                    } ${alignClass}`}
                  >
                    {parseInline(quoteMatch[1], { isUser, isDark })}
                  </blockquote>
                );
              }

              // Unordered List Item: - item, * item, + item, • item
              const bulletMatch = trimmed.match(/^(\s*)([-*+•])\s+(.*)$/);
              if (bulletMatch) {
                const indentLevel = bulletMatch[1].length >= 2 ? 'pl-4' : 'pl-1';
                return (
                  <div
                    key={lineIdx}
                    dir={dirAttr}
                    className={`flex items-start gap-2 my-1 ${indentLevel} ${alignClass}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        isUser
                          ? 'bg-white/90 shadow-xs'
                          : isDark
                          ? 'bg-purple-400 shadow-xs'
                          : 'bg-gradient-to-tr from-[#6C47C9] to-[#7B52DE] shadow-xs'
                      }`}
                    />
                    <div className="flex-1 leading-relaxed">
                      {parseInline(bulletMatch[3], { isUser, isDark })}
                    </div>
                  </div>
                );
              }

              // Ordered List Item: 1. item, 2) item
              const numMatch = trimmed.match(/^(\s*)(\d+)[.)]\s+(.*)$/);
              if (numMatch) {
                const num = numMatch[2];
                const indentLevel = numMatch[1].length >= 2 ? 'pl-4' : 'pl-0.5';
                return (
                  <div
                    key={lineIdx}
                    dir={dirAttr}
                    className={`flex items-start gap-2 my-1 ${indentLevel} ${alignClass}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        isUser
                          ? 'bg-white/20 text-white'
                          : isDark
                          ? 'bg-purple-900/70 border border-purple-700/60 text-purple-300'
                          : 'bg-purple-100 text-xperience-purple shadow-2xs'
                      }`}
                    >
                      {num}
                    </span>
                    <div className="flex-1 leading-relaxed">
                      {parseInline(numMatch[3], { isUser, isDark })}
                    </div>
                  </div>
                );
              }

              // Standard Paragraph
              return (
                <p key={lineIdx} dir={dirAttr} className={`leading-relaxed my-0.5 ${alignClass}`}>
                  {parseInline(trimmed, { isUser, isDark })}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
