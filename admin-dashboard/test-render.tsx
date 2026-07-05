import { renderToString } from 'react-dom/server';
import React from 'react';
import { DashdarkWrapper } from './src/DashdarkWrapper';

try {
  renderToString(React.createElement(DashdarkWrapper));
  console.log("Render successful!");
} catch (e) {
  console.error("Render failed:");
  console.error(e);
}
