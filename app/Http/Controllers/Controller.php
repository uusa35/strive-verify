<?php

namespace App\Http\Controllers;

use App\Services\Traits\ImageHelpers;

abstract class Controller
{
    use ImageHelpers;
    const TAKE_MAX = 100;
    const TAKE_LARGE = 50;
    const TAKE_MID = 24;
    const TAKE_LESS = 12;
    const TAKE_MIN = 6;
}
