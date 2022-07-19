import importToCDN from 'vite-plugin-cdn-import'

/**
 * 需要主入到  index.html ejs 模版的数据
 * @param {*} env  env配置
 * @param {*} isBuild 
 * @returns 
 */
export default function createImportToCDN(env) {

    const { VITE_IS_IMPORT_TO_CDN } = env;
    const cdnUrl = '//unpkg.com';
    const cdns = [
        {
            name: 'vue',
            var: 'Vue',
            path: `${cdnUrl}/vue@3.2.33/dist/vue.runtime.global.prod.js`
        },
        {
            name: 'vue-router',
            var: 'VueRouter',
            path: `${cdnUrl}/vue-router@4.0.15/dist/vue-router.global.prod.js`
        },
        {
            name: 'axios',
            var: 'axios',
            path: `${cdnUrl}/axios@0.27.2/dist/axios.min.js`
        },
        {
            name: 'dayjs',
            var: 'dayjs',
            path: `${cdnUrl}/dayjs@1.11.2/dayjs.min.js`
        },
        {
            name: 'element-plus',
            var: 'ElementPlus',
            path: `${cdnUrl}/element-plus@2.2.0`,
            css: `${cdnUrl}/element-plus@2.2.0/dist/index.css`
        },
        {
            name: '@element-plus/icons-vue',
            var: 'IconsVue',
            path: `${cdnUrl}/@element-plus/icons-vue@2.0.4`,
        },
        {
            name: '@vueuse/core',
            var: 'VueUse',
            path: `${cdnUrl}/@vueuse/core`,
        },
        {
            name: 'echarts',
            var: 'echarts',
            path: `${cdnUrl}/echarts@5.3.3/dist/echarts.min.js`,
        }
    ];

    return importToCDN({
        modules: VITE_IS_IMPORT_TO_CDN ? cdns : []
    });
}