import React from "react";
import Button from "@atlaskit/button";
import { lighten, darken } from "polished";

import { PRIMARY } from "../../styles/constants";

const ButtonEl = (props) => (
  <Button
    {...props}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...extract(customTheme, themeProps),
        },
        ...rest,
      };
    }}
  />
);

const customTheme = {
  link: {
    color: {
      default: PRIMARY,
      hover: lighten(0.05, PRIMARY),
      active: darken(0.05, PRIMARY),
    },
  },
  primary: {
    background: {
      default: PRIMARY,
      hover: lighten(0.05, PRIMARY),
      active: darken(0.05, PRIMARY),
    },
  },
};

function extract(newTheme, { mode, appearance, state }) {
  if (!newTheme[appearance]) {
    return undefined;
  }
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc, val) => {
    let node = root;
    [val, state, mode].forEach((item) => {
      if (!node[item]) {
        return undefined;
      }
      if (typeof node[item] !== "object") {
        acc[val] = node[item];
        return undefined;
      }
      node = node[item];
      return undefined;
    });
    return acc;
  }, {});
}

export default ButtonEl;
