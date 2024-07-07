import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    restaurants: {},
    activeRestaurant: {},
    filtredMenus: [],
    categories_menus: {},
    menus: {},
    visibleMenus: [],
    visibleItems: [],
    activeMenu: {},
    menuItems: {},
    categories_ids: [],
    categories: [],
    access_token: '',
  },
  getters: {
    RESTAURANTS: (state) => state.restaurants,
    ACTIVE_RESTAURANT: (state) => state.activeRestaurant,
    MENUS: (state) => state.menus,
    ACTIVE_MENU: (state) => state.activeMenu,
    MENU_ITEMS: (state) => state.menuItems,
    FILTRED_MENUS: (state) => state.filtredMenus,
    CATEGORIES_MENUS: (state) => state.categories_menus,
    VISIBLE_ITEMS: (state) => state.visibleItems,
    VISIBLE_MENUS: (state) => state.visibleMenus,
    ACCESS_TOKEN: (state) => state.access_token,
    CATEGORIES_IDS: (state) => state.categories_ids,
    CATEGORIES: (state) => state.categories,
  },
  mutations: {
    setRestaurants: (state, payload) => {
      state.restaurants = payload
    },
    setMenus: (state, payload) => {
      state.menus = payload
    },
    setFiltredMenus: (state, payload) => {
      state.filtredMenus = payload
    },
    setVisibleMenus: (state, payload) => {
      state.visibleMenus = payload
    },
    setAccessToken: (state, payload) => {
      state.access_token = payload
    },
    setActiveRestaurant: (state, payload) => {
      state.activeRestaurant = payload
    },
    setActiveMenu: (state, payload) => {
      state.activeMenu = payload
    },
    setMenuItems: (state, payload) => {
      state.menuItems = payload
    },
    setVisibleItems: (state, payload) => {
      state.visibleItems = payload
    },
    setCategoriesIds: (state, payload) => {
      state.categories_ids = payload
    },
    setCategories: (state, payload) => {
      state.categories = payload
    },
    setCategoriesMenus: (state, payload) => {
      state.categories_menus = payload
    },
  },
  actions: {
    setRestaurants: ({ commit }, payload) => {
      commit('setRestaurants', payload)
    },
    setMenus: ({ commit }, payload) => {
      commit('setMenus', payload)
    },
    setFiltredMenus: ({ commit }, payload) => {
      commit('setFiltredMenus', payload)
    },
    setVisibleMenus: ({ commit }, payload) => {
      commit('setVisibleMenus', payload)
    },
    setAccessToken: ({ commit }, payload) => {
      commit('setAccessToken', payload)
    },
    setActiveRestaurant: ({ commit }, payload) => {
      commit('setActiveRestaurant', payload)
    },
    setActiveMenu: ({ commit }, payload) => {
      commit('setActiveMenu', payload)
    },
    setMenuItems: ({ commit }, payload) => {
      commit('setMenuItems', payload)
    },
    setVisibleItems: ({ commit }, payload) => {
      commit('setVisibleItems', payload)
    },
    setCategoriesIds: ({ commit }, payload) => {
      commit('setCategoriesIds', payload)
    },
    setCategories: ({ commit }, payload) => {
      commit('setCategories', payload)
    },
    setCategoriesMenus: ({ commit }, payload) => {
      commit('setCategoriesMenus', payload)
    },
  },
  modules: {},
})
