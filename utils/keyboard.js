import { InlineKeyboard, Keyboard } from 'grammy';

export const keyboard = new Keyboard()
  .text('🔐 Login')
  .row()
  .text('🆗 Add coin')
  .text('📋 List')
  .row()
  .text('👁 All transaction')
  .text('🔍 Search coin')
  .resized()
  .persistent();

export const inlineKeyboard = new InlineKeyboard().text('Click', 'ff');
