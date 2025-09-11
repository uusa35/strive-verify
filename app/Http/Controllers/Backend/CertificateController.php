<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificateRequest;
use App\Http\Requests\UpdateCertificateRequest;
use App\Models\Certificate;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;
use Choowx\RasterizeSvg\Svg;

class CertificateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->has('participant_id')) {
            $elements = Certificate::where('participant_id', request('participant_id'))->orderBy('id', 'desc')->paginate(SELF::TAKE_MAX);
        } else {
            $elements = Certificate::orderBy('id', 'desc')->paginate(SELF::TAKE_MAX);;
        }
        return inertia('Backend/Certificate/CertificateIndex', compact('elements'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $validator = validator(request()->all(), [
            'participant_id' => 'required|exists:participants,id',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }
        return inertia('Backend/Certificate/CertificateCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCertificateRequest $request)
    {

        try {
            $element = Certificate::create($request->except('image', 'path'));
            $request->file("image") ? $this->saveMimes(
                $element,
                $request,
                ["image"],
                ["1920", "1080"],
                true,
                false
            ) : null;
            $request->file("path") ? $this->savePath($element, $request, "path") : null;
            $svgCode =   QrCode::merge(public_path('images/logo_english.jpg'), 0.2, true)
                ->size(800)
                ->style('dot', 0.9)
                ->format('svg')
                ->backgroundColor(255, 255, 255)
                ->errorCorrection('H')
                ->eyeColor(0, 1, 194, 211, 0, 0, 0)
                ->eyeColor(1, 1, 194, 211, 0, 0, 0)
                ->eyeColor(2, 1, 194, 211, 0, 0, 0)
                ->generate(route('certificate.show', $element->id));

            // $tempSvgPath = tempnam(sys_get_temp_dir(), 'svg_');
            // $defaultFilename = 'default.svg';
            // $defaultPath = storage_path("app/public/uploads/images/qr/{$defaultFilename}");
            // File::ensureDirectoryExists(dirname($defaultPath));
            // File::put($defaultPath, $svgCode);
            Svg::make($svgCode)->saveAsPng(storage_path("app/public/uploads/images/qr/{$element->id}.png"));

            $element->update(['qr' => "{$element->id}.png"]);
            // File::copy($defaultPath, storage_path("app/public/uploads/images/qr/{$newFileName


            // $newFileName = time() . '.svg';
            // $newFilePath = storage_path(
            //     "app/public/uploads/images/qr/{$newFileName}"
            // );
            // File::put($newFilePath, $svgCode);
            // $element->update(['qr' => $newFileName]);
            return redirect()->route('backend.certificate.index', ['participant_id' => $element->participant_id])->with('success', 'تم إضافة الشهادة');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificate $certificate)
    {
        $element = $certificate->load('participant');
        return inertia('Backend/Certificate/CertificateShow', compact('element'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certificate $certificate)
    {
        return inertia('Backend/Certificate/CertificateEdit', ['element' => $certificate]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateRequest $request, Certificate $certificate)
    {
        $element = $certificate->update($request->except('image', 'path'));
        $request->file("image") ? $this->saveMimes(
            $certificate,
            $request,
            ["image"],
            ["1920", "1080"],
            true,
            false
        ) : null;
        $request->file("path") ? $this->savePath($certificate, $request, "path") : null;
        return redirect()->route('backend.certificate.index', ['participant_id' => $certificate->participant_id])->with('success', 'تم إضافة الشهادة');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificate $certificate)
    {
        $certificate->delete();
        return redirect()->back()->with('success', 'تم حذف الشهادة');
    }
}
