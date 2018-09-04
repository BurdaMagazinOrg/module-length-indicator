(function (Drupal, $) {
  'use strict';
  Drupal.behaviors.length_indicator = {
    attach: function (context, settings) {
      $(context)
        .find('[length-indicator-enabled]')
        .once('length-indicator')
        .each(function (index, element) {
          var $el = $(element);
          var total = $el.data('length-indicator-total');
          var unit = $el.data('length-indicator-unit');
          var font = $el.data('length-indicator-font');

          new Indicator($el, $el.closest('.form-wrapper'), total, unit, font);
        });
    }
  };

  function Indicator($el, $context, total, unit, font) {
    this.$el = $el;

    this.total = total;
    this.unit = unit;
    this.font = font;

    this.allIndicators = $context.find('.length-indicator__indicator');
    this.cursor = $context.find('.length-indicator__cursor');

    var self = this;
    this.$el.on('input', function (e) {
      self.setCursorAndActiveIndicator();
    });
    this.setCursorAndActiveIndicator();
  }

  Indicator.prototype.setCursorAndActiveIndicator = function () {
    var length;

    // Google has 600px width max (18px Arial 400)
    if (this.unit === 'px') {
      length = this.measureTextWidth(this.$el.val(), this.$el.data('drupal-selector'));
    }
    else {
    // Default unit is characters.
      length = this.$el.val().length;
    }

    var position = (length / this.total) * 100;

    position = position < 100 ? position : 100;
    this.cursor.css('left', position + '%');

    this.allIndicators.removeClass('is-active');

    var coloredIndicator = this.allIndicators.eq(0);
    for (var i = 1; i < this.allIndicators.length; i++) {
      var indicator = this.allIndicators.eq(i);
      if (length >= indicator.data('pos')) {
        coloredIndicator = indicator;
      }
      else {
        break;
      }
    }
    coloredIndicator.addClass('is-active');
  };

  /**
   * Creates an hidden element with the purpose to calculate the sizes of elements and adds these elements to the body.
   *
   * @return {HTMLElement} The created hidden element.
   */
  Indicator.prototype.createMeasurementElement = function (id) {
    var hiddenElement = document.createElement('div');

    hiddenElement.id = 'length-indicator-measure-' + id;

    // Styles to prevent unintended scrolling in Gutenberg.
    hiddenElement.style.position = 'absolute';
    hiddenElement.style.left = '-9999em';
    hiddenElement.style.top = 0;
    hiddenElement.style.height = 0;
    hiddenElement.style.overflow = 'hidden';
    hiddenElement.style.font = this.font;

    document.body.appendChild(hiddenElement);
    return hiddenElement;
  };

  /**
   * Measures the width of the text using a hidden element.
   *
   * @param {string} text The text to measure the width for.
   * @return {number} The width in pixels.
   */
  Indicator.prototype.measureTextWidth = function (text, id) {
    var element = document.getElementById('length-indicator-measure-' + id);
    if (!element) {
      element = this.createMeasurementElement(id);
    }
    element.innerHTML = text;
    return element.offsetWidth;
  };

})(Drupal, jQuery);
