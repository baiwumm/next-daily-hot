import { heroui } from "@heroui/react";
export default heroui({
  layout: {
    radius: {
      small: "6px", // rounded-small
      medium: "8px", // rounded-medium
      large: "10px", // rounded-large
    },
    borderWidth: {
      small: "0.5px", // border-small
      medium: "1px", // border-medium (default)
      large: "2px", // border-large
    }
  },
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#F82006'
        }
      }
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#F82006'
        }
      }
    }
  }
});