`globalData.js`  -- 全局数据，挂载在初始化Vue时的实例上，组件中可通过`this.$root`访问。
`globalFilter.js`  -- 全局过滤器，组件中无需注册可直接使用。
`globalMethods.js`  -- 全局方法。

项目很大，多人协作时，可考虑模块化，模块自治。