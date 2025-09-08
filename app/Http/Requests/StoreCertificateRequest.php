<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
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
            'title' => 'required|min:3|max:255',
            'content' => 'nullable',
            'path' => 'required|max:100000|mimes:xlsx,doc,docx,ppt,pptx,pdf,zip',
            'image' => 'nullable|image|max:100000',
            'participant_id' => 'required|exists:participants,id',
            'active' => 'required|in:1,0',
        ];
    }
}
