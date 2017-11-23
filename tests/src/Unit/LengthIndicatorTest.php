<?php

namespace Drupal\Tests\length_indicator\Unit;

use Drupal\Tests\UnitTestCase;

/**
 * Tests the code in length_indicator.module.
 *
 * @group length_indicator
 *
 * Note we load code, so isolate the test.
 *
 * @runInSeparateProcess
 * @preserveGlobalState disabled
 */
class LengthIndicatorTest extends UnitTestCase {

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();
    include_once __DIR__ . '/../../../length_indicator.module';
  }

  /**
   * Tests _length_indicator_get_width_and_pos().
   *
   * @dataProvider providerTestLengthIndicatorGetWidthAndPos
   */
  public function testLengthIndicatorGetWidthAndPos($optimin, $optimax, $tolerance, array $expected) {
    $this->assertEquals($expected, _length_indicator_get_width_and_pos($optimin, $optimax, $tolerance));
  }

  /**
   * Data provider for testLengthIndicatorGetWidthAndPos().
   *
   * @return array
   *   An array with of arguments for testLengthIndicatorGetWidthAndPos().
   */
  public function providerTestLengthIndicatorGetWidthAndPos() {
    return [
      [
        10, 15, 5,
        [
          [
            'width' => 20.0,
            'pos' => 0,
            'class' => 'bad',
          ],
          [
            'width' => 20.0,
            'pos' => 5,
            'class' => 'ok',
          ],
          [
            'width' => 20.0,
            'pos' => 10,
            'class' => 'good',
          ],
          [
            'width' => 20.0,
            'pos' => 16,
            'class' => 'ok',
          ],
          [
            'width' => 20.0,
            'pos' => 21,
            'class' => 'bad',
          ],
        ],
      ],
      'zero_tolerance' => [
        10, 15, 0,
        [
          [
            'width' => 40.0,
            'pos' => 0,
            'class' => 'bad',
          ],
          [
            'width' => 0.0,
            'pos' => 10,
            'class' => 'ok',
          ],
          [
            'width' => 20.0,
            'pos' => 10,
            'class' => 'good',
          ],
          [
            'width' => 0.0,
            'pos' => 16,
            'class' => 'ok',
          ],
          [
            'width' => 40.0,
            'pos' => 16,
            'class' => 'bad',
          ],
        ],
      ],
      [
        100, 250, 75,
        [
          [
            'width' => 7.142857142857142,
            'pos' => 0,
            'class' => 'bad',
          ],
          [
            'width' => 21.428571428571427,
            'pos' => 25,
            'class' => 'ok',
          ],
          [
            'width' => 42.85714285714286,
            'pos' => 100,
            'class' => 'good',
          ],
          [
            'width' => 21.42857142857143,
            'pos' => 251,
            'class' => 'ok',
          ],
          [
            'width' => 7.142857142857142,
            'pos' => 326,
            'class' => 'bad',
          ],
        ],
      ],
    ];
  }

}
