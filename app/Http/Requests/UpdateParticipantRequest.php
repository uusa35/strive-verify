<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateParticipantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return request()->user()->id == 1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|min:3|max:255',
            'title' => 'nullable|min:3|max:255',
            'email' => 'nullable|min:3|max:255',
            'mobile' => 'nullable|min:3|max:255',
            'civil_id' => 'nullable|min:3|max:255',
            'active' => 'required|in:1,0',
            'type' => 'required|in:student,teacher,employee',
        ];
    }
}
