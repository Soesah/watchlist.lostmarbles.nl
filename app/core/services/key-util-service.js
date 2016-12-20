angular.module('watchlistApp').factory('KeyUtil', function() {
  'use strict';
  var KeyUtil = {
    // control
    TabKey: 9,
    EnterKey: 13,
    SpaceKey: 32,
    BackspaceKey: 8,
    DeleteKey: 46,
    EscapeKey: 27,

    ShiftKey: 16,
    CtrlKey: 17,
    AltKey: 18,
    CommandKey: 91,

    // arrows
    LeftKey: 37,
    UpKey: 38,
    RightKey: 39,
    DownKey: 40,

    // punctuation
    DotKey: 190,
    ColonKey: 186,
    CommaKey: 188,

    // numbers
    OneKey: 49,
    TwoKey: 50,
    ThreeKey: 51,
    FourKey: 52,
    FiveKey: 53,
    SixKey: 54,
    SevenKey: 55,
    EightKey: 56,
    NineKey: 57,
    ZeroKey: 48,

    // letters
    AKey: 65,
    DKey: 68,
    EKey: 69,
    FKey: 70,
    IKey: 73,
    PKey: 80,
    SKey: 83
  };

  KeyUtil.ControlKeys = [
    KeyUtil.TabKey,
    KeyUtil.EnterKey,
    KeyUtil.EscapeKey,
    KeyUtil.ShiftKey,
    KeyUtil.CtrlKey,
    KeyUtil.AltKey,
    KeyUtil.CommandKey
  ];

  KeyUtil.ArrowKeys = [
    KeyUtil.LeftKey,
    KeyUtil.UpKey,
    KeyUtil.RightKey,
    KeyUtil.DownKey
  ];

  KeyUtil.NumberKeys = [
    KeyUtil.OneKey,
    KeyUtil.TwoKey,
    KeyUtil.ThreeKey,
    KeyUtil.FourKey,
    KeyUtil.FiveKey,
    KeyUtil.SixKey,
    KeyUtil.SevenKey,
    KeyUtil.EightKey,
    KeyUtil.NineKey,
    KeyUtil.ZeroKey
  ];

  KeyUtil.isArrowKey = function(keyCode) {
    return KeyUtil.ArrowKeys.indexOf(keyCode) !== -1;
  };

  KeyUtil.isNumberKey = function(keyCode) {
    return KeyUtil.NumberKeys.indexOf(keyCode) !== -1;
  };

  KeyUtil.isAlphaNumericKey = function(keyCode) {
    return KeyUtil.ControlKeys.indexOf(keyCode) === -1
        && KeyUtil.ArrowKeys.indexOf(keyCode) === -1;
  };

  return KeyUtil;
});
