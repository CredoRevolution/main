<template>
  <div class="main-wrapper">
    <Settings
      @login="login"
      @filterMenuItems="filterMenuItems"
      @updateVisibleMenus="updateVisibleMenus"
      @updateVisibleCategories="updateVisibleCategories"
      @updateStockFilter="updateStockFilter"
      @updateFormatItem="updateFormatItem"
      @updateTheme="updateTheme"
      @uploadBgImage="uploadBgImage"
      @updateCurrencyType="updateCurrencyType"
      @updateCurrencyLength="updateCurrencyLength"
      @handleFontUpload="handleFontUpload"
      @resetFont="resetFont"
      @updateImagePosition="updateImagePosition"
      @handleImageUpload="handleImageUpload"
    />
    <Display
      :stockFilter="stockFilter"
      :formatItem="formatItem"
      :currencyLength="currencyLength"
      :currencyType="currencyType"
      :currenciesRate="currenciesRate"
      :image="image"
      :imagePosition="imagePosition"
      :theme="theme"
    />
  </div>
</template>

<script>
import Settings from '@/components/Settings.vue'
import Display from '@/components/Display.vue'

import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MainView',
  components: {
    Settings,
    Display,
  },
  computed: {},
  data() {
    return {
      accessCode: null,
      stockFilter: 'soldout',
      formatItem: ['name', 'price', 'description'],
      currencyLength: 1,
      currencyType: 'USD',
      currenciesRate: {
        USD: 1,
        EUR: 0.9,
        RUB: 70,
      },
      initialFont: 'Satoshi Variable, sans-serif',
      image: '',
      imagePosition: 'none',
      theme: 'light',
    }
  },

  methods: {
    login() {
      window.location.href = 'http://localhost:3000/login'
    },
    async getToken() {
      try {
        const response = await axios.get('http://localhost:3000/callback', {
          headers: {
            'x-access-code': this.accessCode,
          },
        })
        console.log(response)
        this.$store.commit('setAccessToken', response.data)
        this.getRestaurants()
      } catch (error) {
        console.log(error)
      }
    },
    async getRestaurants() {
      try {
        console.log('Fetching restaurants... ', this.accessCode)
        const response = await axios.get('http://localhost:3000/restaurants', {
          headers: {
            'x-access-token': this.$store.getters.ACCESS_TOKEN,
          },
        })

        console.log(
          `Access token in Vue component: ${this.$store.getters.ACCESS_TOKEN}`
        )
        if (response.status === 200 && Array.isArray(response.data)) {
          this.$store.commit('setRestaurants', response.data)
        } else {
          console.error(
            'Invalid response data or status code. Expected status code 200 and an array.'
          )
        }
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized error. Please check your access token.')
        } else {
          console.error('Error fetching restaurants:', error.message)
        }
      }
      console.log(this.$store.getters.RESTAURANTS)
      this.getMenus()
    },

    async getMenus() {
      try {
        const response = await axios.get('http://localhost:3000/menus', {
          headers: {
            'x-access-token': this.$store.getters.ACCESS_TOKEN,
          },
        })
        const menus = response.data.objects
        this.$store.commit('setMenus', menus)
        console.log(this.$store.getters.MENUS)
      } catch (error) {
        console.log(error)
      }
      this.getMenuItems()
    },
    updateVisibleMenus() {
      const visibleMenus = []
      this.$store.commit('setVisibleMenus', [])
      this.$store.getters.MENUS.forEach((menu) => {
        if (menu.present_at_all_locations) {
          visibleMenus.push(menu)
        } else if (
          menu.present_at_all_locations === false &&
          menu.present_at_location_ids &&
          menu.present_at_location_ids.includes(
            this.$store.getters.ACTIVE_RESTAURANT.id
          )
        ) {
          visibleMenus.push(menu)
        }
      })
      console.log('Committing visibleMenus array:', visibleMenus)
      this.$store.commit('setVisibleMenus', visibleMenus)
    },
    async getMenuItems() {
      try {
        const response = await axios.get('http://localhost:3000/menuItems', {
          headers: {
            'x-access-token': this.$store.getters.ACCESS_TOKEN,
          },
        })
        this.$store.commit('setMenuItems', response.data.objects)
        console.log(this.$store.getters.MENU_ITEMS)
      } catch (error) {
        console.log(error)
      }
    },
    filterMenuItems() {
      const filteredItems = []
      this.$store.commit('setFiltredMenus', filteredItems)
      console.log(this.$store.getters.ACTIVE_RESTAURANT.id)
      this.$store.getters.MENU_ITEMS.forEach((item) => {
        if (
          (item.present_at_location_ids &&
            item.present_at_location_ids.includes(
              this.$store.getters.ACTIVE_RESTAURANT.id
            )) ||
          item.present_at_all_locations
        ) {
          console.log(item)
          filteredItems.push(item)
        }
      })

      this.$store.commit('setFiltredMenus', filteredItems)
      console.log(this.$store.getters.FILTRED_MENUS)
      this.getFiltredMenuItemsCategories()
    },
    async getFiltredMenuItemsCategories() {
      try {
        this.$store.commit('setCategoriesIds', [])
        this.$store.commit('setCategories', [])
        this.$store.getters.FILTRED_MENUS.forEach((item) => {
          if (item.item_data?.categories && item.item_data.categories.length) {
            item.item_data.categories.forEach((category) => {
              if (!this.$store.getters.CATEGORIES_IDS.includes(category)) {
                this.$store.commit('setCategoriesIds', [
                  ...this.$store.getters.CATEGORIES_IDS,
                  category,
                ])
              }
            })
          }
        })

        console.log(this.$store.getters.CATEGORIES_IDS)
        await Promise.all(
          this.$store.getters.CATEGORIES_IDS.map(async (category) => {
            const response = await axios.get(
              'http://localhost:3000/categories',
              {
                headers: {
                  'x-access-token': this.$store.getters.ACCESS_TOKEN,
                },
                params: {
                  id: category.id,
                },
              }
            )
            console.log(response.data)

            const categoryName = response.data.object.category_data.name
            const categoryData = {
              [categoryName]: response.data.object,
            }
            if (
              !Object.keys(this.$store.getters.CATEGORIES).includes(
                categoryName
              )
            ) {
              this.$store.commit('setCategories', {
                ...this.$store.getters.CATEGORIES,
                ...categoryData,
              })
            }
            console.log(this.$store.getters.CATEGORIES)
          })
        )
      } catch (error) {
        console.log(error)
      }
    },

    updateVisibleCategories(categories) {
      this.$store.commit('setCategoriesMenus', [])
      if (categories.length) {
        this.$store.getters.FILTRED_MENUS.forEach((item) => {
          if (item.item_data?.categories && item.item_data.categories.length) {
            item.item_data.categories.forEach((category) => {
              if (
                categories.includes(category.id) &&
                !this.$store.getters.CATEGORIES_MENUS.includes(item)
              ) {
                this.$store.commit('setCategoriesMenus', [
                  ...this.$store.getters.CATEGORIES_MENUS,
                  item,
                ])
              }
            })
          }
        })
        console.log(this.$store.getters.CATEGORIES_MENUS)
      } else {
        return this.$store.getters.FILTRED_MENUS
      }
    },
    updateStockFilter(state) {
      this.stockFilter = state
    },
    updateFormatItem(state) {
      this.formatItem = state
    },

    async fetchCurrencyList() {
      try {
        const response = await axios.get('http://localhost:3000/currencies')
        this.currenciesRate = response.data
        console.log(this.currenciesRate.data)
      } catch (error) {
        console.log(error)
      }
    },
    updateCurrencyLength(length) {
      this.currencyLength = parseInt(length, 10)
    },
    updateCurrencyType(type) {
      this.currencyType = type
    },
    updateTheme(theme) {
      this.theme = theme
    },
    handleFontUpload(file) {
      console.log(file)
      if (file) {
        this.loadFont(file)
      }
    },

    loadFont(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fontData = e.target.result
        this.applyFont(fontData, file.name)
      }
      reader.readAsDataURL(file)
    },
    applyFont(fontData, fileName) {
      // Определение формата файла по расширению
      const extension = fileName.split('.').pop().toLowerCase()
      let format
      if (extension === 'ttf') format = 'truetype'
      else if (extension === 'otf') format = 'opentype'
      else if (extension === 'woff') format = 'woff'
      else if (extension === 'woff2') format = 'woff2'
      else {
        console.error('Unsupported font format')
        return
      }

      const newStyle = document.createElement('style')
      newStyle.innerHTML = `
        @font-face {
          font-family: '${fileName}';
          src: url(${fontData}) format('${format}');
          font-weight: normal;
          font-style: normal;
        }
        .display-wrapper {
          font-family: '${fileName}', sans-serif !important;
        }
      `
      document.head.appendChild(newStyle)
    },
    resetFont() {
      document.body.style.fontFamily = this.initialFont
    },
    updateImagePosition(position) {
      this.imagePosition = position
    },

    handleImageUpload(file) {
      if (file) {
        this.loadImage(file)
      }
    },
    loadImage(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        this.image = imageData
        this.$nextTick(() => {
          this.image = imageData
          console.log(this.image)
        })
      }
      reader.readAsDataURL(file)
    },
    uploadBgImage() {},
  },

  created() {
    const urlParams = new URLSearchParams(window.location.search)
    this.accessCode = urlParams.get('code')
    console.log(`Access code in Vue component: ${this.accessCode}`) // Логирование токена

    // Проверьте, что ваш accessCode корректен
    if (this.accessCode) {
      this.getToken()
    }
  },
  mounted() {
    this.fetchCurrencyList()
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}

:root {
  --primary-color: #000;
  --background-color: #fff;
}

.light-theme {
  --primary-color: #000;
  --background-color: #fff;
}

.dark-theme {
  --primary-color: #fff;
  --background-color: #333;
}

.yellow-theme {
  --primary-color: #ff0000;
  --background-color: #aef59d;
}

.red-theme {
  --primary-color: #ff0000;
  --background-color: #f5a5a5;
}

.blue-theme {
  --primary-color: #0000ff;
  --background-color: #a5a5f5;
}

.green-theme {
  --primary-color: #2b2b2b;
  --background-color: #a5f5a5;
}

.main-wrapper {
  background-color: var(--background-color);
  color: var(--primary-color);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  height: 100vh;
}
</style>
