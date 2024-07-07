<template>
  <div :class="['input-wrapper', active ? 'active' : '']">
    <label class="main-screen__form-item-label" for="text-input" ref="label">{{
      placeholderText
    }}</label>
    <input
      :name="inputName"
      type="text"
      :class="[
        'main-screen__form-input',
        'main-screen__form-item-warnings',
        $v.name.$error ? 'error' : '',
        !$v.name.$error && $v.name.$model ? 'valid' : '',
        initialValue ? 'textOverflow' : '',
      ]"
      :required="required"
      v-model.trim="$v.name.$model"
      @focusin="active = true"
      @focusout="focus"
      @input="checkValidation"
      ref="input"
    />
    <!-- <div class="error-message" v-if="showError && !$v.name.minLength && !phone">
      Name must have at least {{ $v.name.$params.minLength.min }} letters.
    </div> -->
    <div class="error-message" v-if="showError && !$v.name.required && !phone">
      {{ defaultErrorText }}
    </div>
    <div class="error-message" v-if="showError && !$v.name.phoneCheck && phone">
      Please enter a valid phone number
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'CustomInput',
  props: {
    placeholderText: {
      type: String,
      required: true,
    },
    phone: {
      type: Boolean,
      required: false,
    },
    defaultErrorText: {
      type: String,
      required: false,
    },
    inputName: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
      required: false,
    },
    initialValue: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      name: '',
      isValid: false,
      showError: false,
      active: false,
    }
  },
  validations: {
    name: {
      phoneCheck(value) {
        if (!this.phone) {
          return true
        }
        const regex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        return regex.test(value)
      },
      required,
      // minLength: minLength(5),
    },
  },
  mounted() {
    this.resetValidation()
  },
  watch: {
    name() {
      this.active = true
    },
  },

  methods: {
    checkValidation() {
      if (this.$v) {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.isValid = true
          this.getData()
        } else {
          this.isValid = false
          this.showError = true

          setTimeout(() => {
            const errorElement = document.querySelector('.error')
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth' })
            }
          }, 0)
        }
      }
      return this.isValid
    },
    resetValidation() {
      this.$v.$reset()
      this.isValid = false
      this.showError = false
    },
    focus() {
      if (this.name === '') {
        this.active = false
      } else {
        this.active = true
      }
    },
    getData() {
      this.$emit('getData', this.inputName, this.name)
    },
  },

  mounted() {
    if (this.initialValue) {
      this.name = this.initialValue
    }
  },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return ($px / 16px) + rem;
}

.input-wrapper {
  position: relative;
  label {
    position: absolute;
    transition: all 0.3s ease;
    font-size: rem(17px);
    line-height: rem(21px);
    font-weight: 500;
    top: rem(15px);
    left: rem(15px);
    color: #86868b;
    pointer-events: none;
  }
  &.active {
    label {
      top: rem(6px);
      left: rem(15px);
      font-weight: 500;
      font-size: rem(13px);
      line-height: rem(17.5px);
      color: #86868b;
      transition: all 0.3s ease;
    }
  }
  .main-screen__form-input {
    background: #fff;
    border-radius: rem(13px);
    padding: rem(23px) rem(15px) rem(8px) rem(15px);
    width: 100%;
    font-weight: 500;
    font-size: rem(17px);
    line-height: rem(21px);
    color: #14121f;
    border: 1px solid #86868b80;
    &.error {
      border: 1px solid red;
    }
    &.valid {
      border: 1px solid #0071e2;
      transition: all 0.3s ease;
    }
    &.textOverflow {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 25%;
    }
    &::placeholder {
      color: #86868b;
      font-weight: 500;
      font-size: rem(17px);
      line-height: rem(21px);
    }
    &:focus {
      border: 1px solid #0071e2 !important;
      color: #14121f;
      outline: none;
      box-shadow: 0px 0px 8px #0071e254;
      transition: all 0.3s ease;
      &::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: rem(13px);
        z-index: 1;
        transition: all 0.3s;
        box-sizing: content-box;
        background: rgba(0, 113, 226, 0.25);
        backdrop-filter: blur(5px);
      }
    }
    &:active {
      border: 1px solid #0071e2 !important;
      color: #14121f;
    }
    &:focus-visible {
      border: 1px solid #0071e2 !important;
      outline: none;
    }
  }
}

@media (max-height: 900px) {
  .input-wrapper {
    label {
      top: rem(10px);
      left: rem(12px);
    }
    &.active {
      label {
        top: rem(3px);
      }
    }

    .main-screen__form-input {
      padding: rem(19px) rem(12px) rem(4px) rem(14px);
    }
  }
}

@media (max-width: 768px) {
  .input-wrapper {
    label {
      top: rem(15px);
      left: rem(15px);
    }
    &.active {
      label {
        top: rem(6px);
      }
    }
    .main-screen__form-input {
      padding: rem(23px) rem(15px) rem(8px) rem(15px);
    }
  }
  .input-wrapper .main-screen__form-input.textOverflow {
    padding-right: 30%;
  }
}
</style>
