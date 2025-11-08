<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->id == 1;
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
            'content' => 'nullable|max:100000',
            'path' => 'nullable|max:100000|mimes:xlsx,doc,docx,ppt,pptx,pdf,zip',
            // 'image' => 'nullable|imax:100000',
            'active' => 'required|in:1,0',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->sometimes('path', 'mimes:xlsx,doc,docx,ppt,pptx,pdf,zip|max:100000', function ($input) {
            return $input->path instanceof \Illuminate\Http\UploadedFile;
        });

        $validator->sometimes('path', 'string', function ($input) {
            return is_string($input->path);
        });
    }
}
