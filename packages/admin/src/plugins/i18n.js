import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ElementLocale from 'element-ui/lib/locale';
import { localeModules } from '@/modules';

Vue.use(VueI18n);

const loadLocaleMessages = () => {
  const messages = {};
  const moduleKeys = Object.keys(localeModules);
  if (moduleKeys.length > 0) {
    for (let i = 0; i < moduleKeys.length; i += 1) {
      localeModules[moduleKeys[i]].keys().forEach((key) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
          const locale = matched[1];
          messages[locale] = {
            ...localeModules[moduleKeys[i]](key),
            ...messages[locale],
          };
        }
      });
    }
  }
  // console.log(messages, 'messages'); // debug
  return messages;
};

const detectLanguage = () => {
  const locale = localStorage.getItem('language');
  if (locale) {
    return locale;
  }
  let language = '';
  if (window.navigator.language.split('-')[0] === 'zh') {
    language = 'zhHans';
  } else {
    language = window.navigator.language.split('-')[0] || 'en';
  }
  localStorage.setItem('language', language);
  return language;
};

const i18n = new VueI18n({
  locale: detectLanguage(),
  fallbackLocale: 'zhHans',
  messages: loadLocaleMessages(),
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
