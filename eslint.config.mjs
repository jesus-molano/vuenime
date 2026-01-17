// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Permitir múltiples atributos en la misma línea
    'vue/first-attribute-linebreak': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    // Permitir self-closing en elementos void (compatible con Prettier)
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    // Mantener indentación consistente
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      },
    ],
  },
})
