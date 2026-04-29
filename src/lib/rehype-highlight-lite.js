/**
 * Lightweight rehype-highlight that only bundles specified languages.
 * Drop-in replacement that avoids importing lowlight's `common` grammars.
 */
import {toText} from 'hast-util-to-text';
import {createLowlight} from 'lowlight';
import {visit} from 'unist-util-visit';

export default function rehypeHighlightLite(options) {
  const settings = options || {};
  const lowlight = createLowlight(settings.languages || {});

  if (settings.aliases) {
    lowlight.registerAlias(settings.aliases);
  }

  return function (tree, file) {
    visit(tree, 'element', function (node, _, parent) {
      if (
        node.tagName !== 'code' ||
        !parent ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre'
      ) {
        return;
      }

      const lang = getLanguage(node);
      if (lang === false || !lang) return;

      if (!Array.isArray(node.properties.className)) {
        node.properties.className = [];
      }

      if (!node.properties.className.includes('hljs')) {
        node.properties.className.unshift('hljs');
      }

      const text = toText(node, {whitespace: 'pre'});

      try {
        const result = lowlight.highlight(lang, text);
        if (result.children.length > 0) {
          node.children = result.children;
        }
      } catch (error) {
        if (/Unknown language/.test(error.message)) {
          file.message(
            'Cannot highlight as `' + lang + '`, it\'s not registered',
            {ancestors: [parent, node], cause: error, place: node.position}
          );
          return;
        }
        throw error;
      }
    });
  };
}

function getLanguage(node) {
  const list = node.properties.className;
  if (!Array.isArray(list)) return;

  for (const value of list) {
    const s = String(value);
    if (s === 'no-highlight' || s === 'nohighlight') return false;
    if (s.startsWith('lang-')) return s.slice(5);
    if (s.startsWith('language-')) return s.slice(9);
  }
}
