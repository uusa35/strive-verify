<?php

namespace App\Services\Traits;

/**
 * Created by PhpStorm.
 * User: usamaahmed
 * Date: 2/6/17
 * Time: 8:21 AM
 */

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Str;

trait ImageHelpers
{
    /**
     * @param  Model  $model
     * @param  Request  $request
     * @param  array  $inputNames
     * @param  array  $sizes
     * @param  array  $dimensions
     * @param  boolean  $ratio
     * @return null
     */
    public function saveMimes(
        Model $model,
        Request $request,
        $inputNames = ['pdf'],
        $dimensions = ['1052', '1320'],
        $ratio = true,
        $enableBg = false,
        $sizes = ['large', 'medium', 'thumbnail']
    ) {
        try {
            $manager = new ImageManager(new Driver());
            foreach ($inputNames as $key => $inputName) {
                if ($request->hasFile($inputName)) {
                    if (in_array($request->file($inputName)->extension(), ['pdf', 'ppt'], true)) {
                        $path = $request->$inputName->storePublicly('public/uploads/files');
                        $path = str_replace('public/uploads/files/', '', $path);
                        $model->update([
                            $inputName => $path,
                        ]);
                    } else {
                        if (in_array($request->file($inputName)->extension(), ['gif'], true)) {
                            if (env('FILESYSTEM_DISK') === 's3') {
                                $this->checkImageSize($request->$inputName);
                                $imagePath = $request->$inputName->storePublicly('storage/uploads/images/thumbnail');
                                $request->$inputName->storePublicly('storage/uploads/images/large');
                                $request->$inputName->storePublicly('storage/uploads/images/medium');
                                $path = str_replace('storage/uploads/images/thumbnail/', '', $imagePath);
                            } else {

                                $this->checkImageSize($request->$inputName);
                                $request->$inputName->storePublicly('public/uploads/images/thumbnail');
                                $request->$inputName->storePublicly('public/uploads/images/medium');
                                $path = $request->$inputName->storePublicly('public/uploads/images/large');
                                $path = str_replace('public/uploads/images/large/', '', $path);
                            }
                            $model->update([
                                $inputName => $path,
                            ]);
                        } else {

                            if (env('FILESYSTEM_DISK') === 's3') {

                                $this->checkImageSize($request->$inputName);
                                $imagePath = $request->$inputName->store('storage/uploads/images/thumbnail');
                                $request->$inputName->store('storage/uploads/images/large');
                                $request->$inputName->store('storage/uploads/images/medium');
                                $imagePath = str_replace('storage/uploads/images/thumbnail/', '', $imagePath);
                            } else {
                                $image = $request->$inputName;
                                $fileName = str_replace(' ', '_', time() . ' ' . $image->getClientOriginalName());
                                // Define paths
                                $thumbnail = $manager->read($image->getRealPath())->scale(width: 300)->resize(300, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                });
                                $imagePath = Storage::disk('public')->put(
                                    'uploads/images/thumbnail/' . $fileName,
                                    $thumbnail->encode()
                                );

                                // Process medium
                                $medium = $manager->read($image->getRealPath())->scale(width: 500)->resize(500, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                });
                                Storage::disk('public')->put(
                                    'uploads/images/medium/' . $fileName,
                                    $medium->encode()
                                );

                                // Process large
                                $large = $manager->read($image->getRealPath())->scale(width: 1500)->resize(1500, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                });

                                Storage::disk('public')->put(
                                    'uploads/images/large/' . $fileName,
                                    $large->encode()
                                );
                            }

                            $model->update([
                                $inputName => $fileName,
                            ]);
                            Storage::delete('public/uploads/images/' . $fileName);
                        }
                    }
                } else {
                    // in case there is no file
                    return response()->json(['message' => 'else case for image'], 400);
                }
            }
        } catch (\Exception $e) {
            abort(404, $e->getMessage());
        }
    }


    public function checkImageSize($img)
    {

        if (filesize($img) > 1000000) {

            // $e = new RuntimeException('image is large. reduce image size to (1000kb) !!!');
            // report($e); // reported
            // return throw $e;
            // return redirect()->back()->withErrors($e->getMessage());
            abort(404, 'image size is too large. reduce image size to (1000kb) !!!');
        }
    }


    public function savePath($element, Request $request, $colName = 'file')
    {
        try {
            if ($request->hasFile($colName)) {
                $path = $request->file($colName)->store('uploads/files', 'public');
                $path = str_replace('uploads/files/', '', $path);
                $element->update([$colName => $path]);
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
