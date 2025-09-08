<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Participant;

class HomeController extends Controller
{
    public function __invoke()
    {
        if (request()->has('type')) {
            $elements = Participant::where('type', request('type'))->orderBy('id', 'desc')->paginate(SELF::TAKE_LARGE);
        } else {
            $elements = Participant::orderBy('id', 'desc')->paginate(SELF::TAKE_LARGE);
        }
        return inertia('Backend/Participant/ParticipantIndex', compact('elements'));
    }
}
