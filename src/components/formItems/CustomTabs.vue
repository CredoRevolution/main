<template>
  <div
    class="main-screen__form-switch main-screen__form-item-warnings"
    :class="{ error: this.showError }"
    @click="resetValidation"
  >
    <div class="main-screen__form-switch-slider"></div>
    <button
      class="main-screen__form-switch-btn passive"
      type="button"
      @click.prevent="makeActive"
    >
      1-10
    </button>
    <button
      class="main-screen__form-switch-btn"
      type="button"
      @click.prevent="makeActive"
    >
      11-50
    </button>
    <button
      class="main-screen__form-switch-btn"
      type="button"
      @click.prevent="makeActive"
    >
      51-199
    </button>
    <button
      class="main-screen__form-switch-btn"
      type="button"
      @click.prevent="makeActive"
    >
      200-499
    </button>
    <button
      class="main-screen__form-switch-btn"
      type="button"
      @click.prevent="makeActive"
    >
      500+
    </button>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'CustomTabs',
  props: {
    defaultErrorText: {
      type: String,
      required: false,
    },
    definition: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      showError: false,
      selected: '1-10',
    }
  },
  validations: {
    selected: {
      required,
    },
  },
  methods: {
    checkValidation() {
      const activeButtons = document.querySelectorAll(
        '.main-screen__form-switch-btn.active'
      )
      if (activeButtons.length > 0) {
        this.getData()
        return true
      } else {
        this.showError = true
        return false
      }
    },
    getData() {
      this.$emit('getData', this.definition, this.selected)
    },
    resetValidation() {
      this.$v.$reset()
      this.showError = false
    },

    makeActive(e) {
      const slider = this.$el?.querySelector('.main-screen__form-switch-slider')
      const buttons = this.$el?.querySelectorAll(
        '.main-screen__form-switch-btn'
      )
      buttons?.forEach((button) => {
        button.classList.remove('active')
        button.classList.remove('passive')
      })
      e.target?.classList.add('active')
      this.selected = e.target?.textContent

      const sliderContainer = slider?.parentElement
      const activeButton = Array.from(buttons || []).find((button) =>
        button.classList.contains('active')
      )
      const activeButtonIndex = Array.from(buttons || []).indexOf(activeButton)
      const activeButtonOffsetTop = activeButton?.offsetTop ?? 0
      const activeButtonOffsetLeft = activeButton?.offsetLeft ?? 0
      const activeButtonHeight = activeButton?.offsetHeight ?? 0
      const activeButtonWidth = activeButton?.offsetWidth ?? 0
      const targetButtonIndex = Array.from(buttons || []).indexOf(e.target)
      const targetButtonOffsetTop = e.target?.offsetTop ?? 0
      const targetButtonOffsetLeft = e.target?.offsetLeft ?? 0
      const targetButtonHeight = e.target?.offsetHeight ?? 0
      const targetButtonWidth = e.target?.offsetWidth ?? 0

      const isToRight = targetButtonIndex > activeButtonIndex

      sliderContainer?.classList.remove('left')
      sliderContainer?.classList.remove('right')
      sliderContainer?.classList.add(isToRight ? 'right' : 'left')

      const targetTop =
        activeButtonOffsetTop +
        (targetButtonOffsetTop - activeButtonOffsetTop) *
          (targetButtonIndex - activeButtonIndex)
      const targetLeft =
        activeButtonOffsetLeft +
        (targetButtonOffsetLeft - activeButtonOffsetLeft) *
          (targetButtonIndex - activeButtonIndex)
      const targetHeight = targetButtonHeight
      const targetWidth = targetButtonWidth
      if (
        targetTop >= 0 &&
        targetTop + targetHeight <= sliderContainer.offsetHeight &&
        targetLeft >= 0 &&
        targetLeft + targetWidth <= sliderContainer.offsetWidth
      ) {
        slider.style.top = `${
          targetTop - (targetHeight - activeButtonHeight) / 2
        }px`
        slider.style.left = `${
          targetLeft - (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetHeight}px`
        slider.style.width = `${targetWidth}px`
      } else if (targetTop < 0) {
        slider.style.top = '0px'
        slider.style.left = `${
          activeButtonOffsetLeft +
          (targetButtonOffsetLeft - activeButtonOffsetLeft) *
            (targetButtonIndex - activeButtonIndex) -
          (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetWidth}px`
      } else if (targetLeft < 0) {
        slider.style.top = `${
          activeButtonOffsetTop +
          (targetButtonOffsetTop - activeButtonOffsetTop) *
            (targetButtonIndex - activeButtonIndex) -
          (targetHeight - activeButtonHeight) / 2
        }px`
        slider.style.left = '0px'
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetButtonWidth}px`
      } else {
        slider.style.top = `${sliderContainer.offsetHeight - targetHeight}px`
        slider.style.left = `${
          activeButtonOffsetLeft +
          (targetButtonOffsetLeft - activeButtonOffsetLeft) *
            (targetButtonIndex - activeButtonIndex) -
          (targetWidth - activeButtonWidth) / 2
        }px`
        slider.style.height = `${targetButtonHeight}px`
        slider.style.width = `${targetButtonWidth}px`
      }
    },
  },
  mounted() {
    this.resetValidation()
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}

.main-screen__form-switch {
  display: flex;
  flex-direction: row;
  padding: rem(3px);
  border: 1px solid #86868b80;
  border-radius: rem(999px);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  position: relative;
  &-slider {
    position: absolute;
    background: rgba(20, 20, 20, 1);
    // border: 1px solid rgba(20, 20, 20, 1);
    border-radius: rem(999px);
    transition: all 0.3s ease;
  }
  &.error {
    border: 1px solid red;
  }
  .main-screen__form-switch-btn {
    padding: rem(12px) rem(17px) !important;
    background: transparent !important;
    border-radius: rem(999px);
    font-weight: 500;
    font-size: rem(17px);
    line-height: rem(21px);
    color: #86868b;
    border: 1px solid transparent !important;
    transition: all 0.3s ease;
    position: relative;
    //   &:not(:last-child):after {
    //     position: absolute;
    //     top: 15%;
    //     right: 0;
    //     height: 70%;
    //     content: '';
    //     margin-left: rem(17px);
    //     border-left: 1px solid #86868b80;
    //   }
    &.passive {
      background: #f5f5f8 !important;
      &::after {
        content: '';
        margin-left: 0;
        border: none;
      }
    }

    &.active {
      transition: all 0.5s ease;
      border-radius: rem(999px);
      color: #fff;
      background: transparent !important;
      border: 1px solid transparent !important;
      &::after {
        content: '';
        margin-left: 0;
        border: none;
      }
      border-left: 0;
    }
  }
}
@media (max-width: 1050px) {
  .main-screen__form-switch {
    justify-content: space-between;
    flex-wrap: nowrap;
    .main-screen__form-switch-btn {
      padding: rem(12px) rem(10px) !important;
    }
  }
}
@media (max-width: 800px) {
  .main-screen__form-switch {
    .main-screen__form-switch-btn {
      padding: rem(8px) rem(5px) !important;
    }
  }
}
@media (max-width: 768px) {
  .main-screen__form-switch {
    .main-screen__form-switch-btn {
      padding: rem(12px) rem(10px) !important;
    }
  }
}

@media (max-width: 420px) {
  .main-screen__form-switch-btn {
    padding: rem(10px) rem(7px) !important;
  }
}
</style>
