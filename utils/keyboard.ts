import { InlineKeyboard, Keyboard } from 'grammy';

const keyboard = new Keyboard()
  .text('🔐 Login')
  .row()
  .text('🆗 Add coin')
  .text('📋 List')
  .row()
  .text('👁 All transaction')
  .text('🔍 Search coin')
  .resized()
  .persistent();

const inlineKeyboard = new InlineKeyboard().text('Click', 'ff');

export default { keyboard, inlineKeyboard };
