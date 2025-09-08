<?php

namespace App\Http\Controllers\Backend;

use App\Enums\ParticipantTypeEnum;
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
            $elements = Participant::where('type', request('type'))->orderBy('id', 'desc')->withCount('certificates')->paginate(SELF::TAKE_MAX);
        } else {
            $elements = Participant::orderBy('id', 'desc')->withCount('certificates')->paginate(SELF::TAKE_MAX);
        }
        return inertia('Backend/Participant/ParticipantIndex', compact('elements'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $types = collect(ParticipantTypeEnum::cases())->pluck('value');
        return inertia('Backend/Participant/ParticipantCreate', compact('types'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreParticipantRequest $request)
    {
        Participant::create($request->validated());
        return redirect()->route('backend.participant.index')->with('success', 'تم إضافة المشارك');
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
        $types = collect(ParticipantTypeEnum::cases())->pluck('value');
        return inertia('Backend/Participant/ParticipantEdit', ['element' => $participant, 'types' => $types]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateParticipantRequest $request, Participant $participant)
    {
        
        $participant->update($request->validated());
        return redirect()->route('backend.participant.index')->with('success', 'تم تعديل المشارك');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        $participant->certificates()->delete();
        $participant->delete();
        return redirect()->back()->with('success', 'تم حذف المشارك');
    }
}
