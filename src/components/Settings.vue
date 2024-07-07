<template>
  <div class="settings-wrapper">
    <button @click="login">Login</button>
    <select
      v-model="restaurantName"
      @change="updateRestaurant"
      v-if="RESTAURANTS.length"
    >
      <option
        v-for="restaurant in RESTAURANTS"
        :key="restaurant.id"
        :value="restaurant.name"
      >
        {{ restaurant.name }}
      </option>
    </select>
    <select
      v-if="this.restaurantName"
      v-model="menuName"
      @change="updateActiveMenu"
    >
      <option
        v-for="menu in VISIBLE_MENUS"
        :key="menu.id"
        :value="menu.menu_data.name"
      >
        {{ menu.menu_data.name }}
      </option>
    </select>
    <div class="categories-wrapper" v-if="CATEGORIES">
      <div
        class="categories-item-wrapper"
        v-for="category in CATEGORIES"
        :key="category.id"
      >
        <input
          type="checkbox"
          @change="updateCategories"
          ref="categories"
          :value="category.id"
        />
        <label>{{ category.category_data.name }}</label>
      </div>
    </div>
    <div class="stock-filter" v-if="VISIBLE_MENUS.length">
      Out Of Stock Items
      <div class="stock-filter__item">
        <input
          type="radio"
          name="stock"
          value="hidden"
          v-model="stockFilter"
          @change="updateStockFilter"
        />
        <label>do not show</label>
      </div>
      <div class="stock-filter__item">
        <input
          type="radio"
          name="stock"
          value="strikethrough"
          v-model="stockFilter"
          @change="updateStockFilter"
        />
        <label>strikethrough</label>
      </div>
      <div class="stock-filter__item">
        <input
          type="radio"
          name="stock"
          value="soldout"
          v-model="stockFilter"
          @change="updateStockFilter"
          checked
        />
        <label>sold out</label>
      </div>
    </div>
    <div class="format-item-wrapper" v-if="VISIBLE_MENUS.length">
      how to format item
      <div class="format-item__item" v-for="item in formatFilters">
        <input
          type="checkbox"
          @change="updateFormatItem"
          :value="item"
          checked
          ref="formatItem"
        />
        <label>{{ item }}</label>
      </div>
    </div>
    <div class="currency-settings">
      <p>Currency Settings</p>
      <input
        type="number"
        v-model="currencyLength"
        placeholder="length"
        @change="updateCurrencyLength"
        min="0"
        max="4"
      />
      <div class="currency-settings__item">
        <input
          type="radio"
          v-model="currencyType"
          value="USD"
          checked
          @change="updateCurrencyType"
        />
        <label>USD</label>
      </div>
      <div class="currency-settings__item">
        <input
          type="radio"
          v-model="currencyType"
          value="USDEUR"
          @change="updateCurrencyType"
        />
        <label>EUR</label>
      </div>
      <div class="currency-settings__item">
        <input
          type="radio"
          v-model="currencyType"
          value="USDRUB"
          @change="updateCurrencyType"
        />
        <label>RUB</label>
      </div>
    </div>
    <div class="upload-font">
      <input
        type="file"
        @change="handleFontUpload"
        accept=".ttf,.otf,.woff,.woff2"
        ref="fontUpload"
      />
      <!-- <button @click="resetFont">reset</button> -->
    </div>
    <div class="image-settings">
      <p>Image Settings</p>
      <input type="file" @change="handleImageUpload" />
      <div class="image-settings__item">
        <input
          type="radio"
          value="top"
          v-model="imagePosition"
          @change="updateImagePosition"
        />
        <label>Top</label>
      </div>
      <div class="image-settings__item">
        <input
          type="radio"
          value="right"
          v-model="imagePosition"
          @change="updateImagePosition"
        />
        <label>Right</label>
      </div>
    </div>
    <div class="theme-switcher">
      <select v-model="theme" @change="updateTheme">
        <option value="light">light</option>
        <option value="dark">dark</option>
        <option value="yellow">yellow</option>
        <option value="blue">blue</option>
        <option value="red">red</option>
        <option value="green">green</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      restaurantName: null,
      menuName: null,
      activeCategories: [],
      stockFilter: 'soldout',
      formatItem: ['name', 'price', 'description'],
      formatFilters: ['name', 'price', 'description'],
      theme: 'light',
      currencyType: 'USD',
      currencyLength: 1,
      imagePosition: 'none',
    }
  },
  computed: {
    ...mapGetters(['RESTAURANTS', 'MENUS', 'VISIBLE_MENUS', 'CATEGORIES']),
  },
  methods: {
    ...mapActions(['setActiveRestaurant', 'setActiveMenu']),
    login() {
      this.$emit('login')
    },
    updateRestaurant() {
      if (this.restaurantName) {
        const restaurant = this.RESTAURANTS.find(
          (restaurant) => restaurant.name === this.restaurantName
        )
        if (restaurant) {
          console.log('set active restaurant', restaurant)
          this.setActiveRestaurant(restaurant)
        }
      }
      this.$emit('updateVisibleMenus')
    },
    updateActiveMenu() {
      if (this.menuName) {
        const menu = this.MENUS.find(
          (menu) => menu.menu_data.name === this.menuName
        )
        if (menu) {
          console.log('set active menu', menu)
          this.setActiveMenu(menu)
        }
        this.$emit('filterMenuItems')
      }
    },
    updateCategories() {
      this.activeCategories = []
      this.$refs.categories.forEach((checkbox) => {
        if (checkbox.checked) {
          this.activeCategories.push(checkbox.value)
        }
      })
      this.$emit('updateVisibleCategories', this.activeCategories)
    },
    updateStockFilter() {
      this.$emit('updateStockFilter', this.stockFilter)
    },
    updateFormatItem() {
      this.formatItem = []
      this.$refs.formatItem.forEach((checkbox) => {
        if (checkbox.checked) {
          this.formatItem.push(checkbox.value)
        }
      })
      console.log(this.formatItem)
      this.$emit('updateFormatItem', this.formatItem)
    },
    updateTheme() {
      this.$emit('updateTheme', this.theme)
    },
    updateCurrencyType() {
      this.$emit('updateCurrencyType', this.currencyType)
    },
    updateCurrencyLength() {
      this.$emit('updateCurrencyLength', this.currencyLength)
    },
    handleFontUpload() {
      console.log(this.$refs.fontUpload.files[0])
      this.$emit('handleFontUpload', this.$refs.fontUpload.files[0])
    },
    resetFont() {
      this.$emit('resetFont')
    },
    updateImagePosition() {
      this.$emit('updateImagePosition', this.imagePosition)
    },
    handleImageUpload(e) {
      this.$emit('handleImageUpload', e.target.files[0])
    },
  },
}
</script>

<style scoped lang="scss">
.settings-wrapper {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: grey;
  height: 100%;
  .stock-filter {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .stock-filter__item {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }
  .format-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .format-item__item {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }
  .image-settings {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .image-settings__item {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }
}
</style>
