<template>
  <div
    class="display-wrapper"
    :class="{
      'flex-column': imagePosition === 'top' && image,
      'flex-row': imagePosition === 'right' && image,
      [`${theme}-theme`]: theme !== null && theme !== undefined,
    }"
    ref="display"
  >
    <div class="items-wrapper">
      <div
        class="display-item"
        v-for="(item, index) in sortedItems"
        :key="item.id"
        :class="getItemClass(item)"
      >
        <h4
          v-if="
            (CATEGORIES_MENUS.length && index === 0) ||
            (CATEGORIES_MENUS.length &&
              item.item_data.categories[0].id !==
                sortedItems[index - 1].item_data.categories[0].id)
          "
          class="main-item-category"
        >
          {{
            item.item_data.categories
              .map((category) => getCategoryName(category.id))
              .join(', ')
          }}
        </h4>
        <div class="main-item-wrapper">
          <div v-if="formatItem.includes('name')" class="main-item-name">
            {{ item.item_data.name }}
          </div>
          <div class="dots"></div>
          <p
            v-if="
              formatItem.includes('price') && getItemClass(item) != 'soldout'
            "
            class="main-item-price"
          >
            {{ getPrice(item) }}
            {{
              currencyType === 'USD' &&
              item.item_data.variations[0].item_variation_data.price_money
                ? 'USD'
                : currencyType.slice(3)
            }}
          </p>
          <p
            v-if="
              formatItem.includes('price') && getItemClass(item) == 'soldout'
            "
            class="main-item-price"
          >
            SOLD OUT
          </p>
        </div>
        <p v-if="formatItem.includes('description')" class="description">
          {{ item.item_data.description }}
        </p>
      </div>
    </div>
    <div class="display-image" v-if="imagePosition !== 'none' && image">
      <img :src="image" alt="image" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Display',
  props: {
    stockFilter: {
      type: String,
      default: 'soldout',
    },
    formatItem: {
      type: Array,
      default: () => ['name', 'price', 'description'],
    },
    currencyLength: {
      type: Number,
      default: 1,
    },
    currencyType: {
      type: String,
      default: 'USD',
    },
    currenciesRate: {
      type: Object,
      default: () => ({}),
    },
    imagePosition: {
      type: String,
      default: 'none',
    },
    image: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
    },
  },
  computed: {
    ...mapGetters([
      'RESTAURANTS',
      'MENUS',
      'ACTIVE_RESTAURANT',
      'ACTIVE_MENU',
      'FILTRED_MENUS',
      'CATEGORIES_MENUS',
      'CATEGORIES',
    ]),
    items() {
      return this.CATEGORIES_MENUS.length
        ? this.CATEGORIES_MENUS
        : this.FILTRED_MENUS
    },
    sortedItems() {
      if (this.CATEGORIES_MENUS.length) {
        return this.items.sort((a, b) => {
          if (a.item_data.categories[0].id > b.item_data.categories[0].id) {
            return 1
          } else {
            return -1
          }
        })
      } else {
        return this.items
      }
    },
  },
  methods: {
    getItemClass(item) {
      return item.absent_at_location_ids &&
        item.absent_at_location_ids.includes(this.ACTIVE_RESTAURANT.id)
        ? this.stockFilter
        : ''
    },
    getPrice(item) {
      if (item.item_data.variations[0].item_variation_data.price_money) {
        const price =
          item.item_data.variations[0].item_variation_data.price_money.amount
        const decimalCount = parseInt(this.currencyLength, 10)
        const priceInCurrency =
          this.currencyType === 'USD'
            ? price
            : price * this.currenciesRate.data[this.currencyType]
        return priceInCurrency.toFixed(decimalCount).replace('.', ',')
      } else if (
        item.item_data.variations[0].item_variation_data.pricing_type
      ) {
        return item.item_data.variations[0].item_variation_data.pricing_type
      } else {
        return 'No price'
      }
    },
    getCategoryName(id) {
      return Object.values(this.CATEGORIES).find(
        (category) => category.id === id
      )?.category_data.name
    },
  },
}
</script>

<style lang="scss" scoped>
.display-wrapper {
  width: 100%;
  border: 10px solid var(--primary-color);
  height: 100%;
  color: var(--primary-color);
  background-color: var(--background-color);
  overflow: hidden;
  &.flex-column {
    display: flex;
    justify-content: flex-end;
    flex-direction: column-reverse;
    .items-wrapper {
      height: 70%;
    }
    .display-image {
      height: 30%;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &.flex-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .items-wrapper {
    }
    .display-image {
      height: 100%;
      width: 30%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .items-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .display-item {
      display: flex;
      flex-direction: column;
      gap: 10px;
      white-space: nowrap;
      width: 25%;
      padding: 10px;
      .main-item-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        .main-item-name {
          font-size: 1em;
          line-height: 1.2em;
        }
        .main-item-price {
          font-size: 1em;
          line-height: 1.2em;
        }
        .dots {
          flex: 1 0;
          border-bottom: 1px dotted var(--primary-color);
          height: 1em;
          margin: 0 0.4em;
          width: 30px;
        }
      }
      .description {
        font-size: 0.8em;
        line-height: 1.2em;
        width: 100%;
        white-space: wrap;
      }

      &.hidden {
        display: none;
      }
      &.visible {
        display: flex;
      }
      &.strikethrough {
        text-decoration: line-through;
      }
      &.soldout {
        // &::after {
        //   content: 'sold out';
        //   color: red;
        // }
      }
    }
  }
  .display-image {
  }
}
</style>
