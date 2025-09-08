<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreParticipantRequest;
use App\Http\Requests\UpdateParticipantRequest;
use App\Models\Participant;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->has('type')) {
            $elements = Participant::where('type', request('type'))->orderBy('id', 'desc')->paginate(SELF::TAKE_MAX);
        } else {
            $elements = Participant::orderBy('id', 'desc')->paginate(SELF::TAKE_MAX);
        }
        return inertia('Backend/Participant/ParticipantIndex', compact('elements'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Backend/Participant/ParticipantCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreParticipantRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Participant $participant)
    {
        return inertia('Backend/Participant/ParticipantEdit', compact('participant'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParticipantRequest $request, Participant $participant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        //
    }
}
