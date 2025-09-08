<?php

namespace App\Services\Traits;

use App\Models\Page;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Request as GuzzeleRequest;
use Illuminate\Http\JsonResponse;

trait DashboardTrait
{

    public function toggleActivate(Request $request)
    {
        $validate = validator($request->all(), [
            'model' => 'string|required',
            'exact' => 'boolean',
            'id' => 'integer|required'
        ]);
        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate->errors()->first());
        }
        $model =  $request->model === 'newslettersubscriber' ? 'NewsletterSubscriber' : ucfirst(request()->model);
        $className = 'App\Models\\' . $model;
        $element = new $className();
        $element = $element->whereId($request->id)->first();
        $element->update([
            'active' => !$element->active
        ]);
        return redirect()->back()->with('success', 'updated successfully');
    }

    public function updateStatus(Request $request)
    {
        $validate = validator($request->all(), [
            "model" => "string|required",
            "status" => ['string', 'required'],
            "id" => "integer|required"
        ]);
        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate->errors()->first());
        }
        $className = "App\Models\\" . ucfirst($request->model);
        $element = new $className();
        $element = $element->whereId($request->id)->first();
        $element->update([
            "status" => $request->status
        ]);
        return redirect()->back()->with("success", 'updated successfully');
    }

    public function toggleOrder(Request $request)
    {
        $validate = validator($request->all(), [
            "model" => "string|required",
            'order' => 'string|in,up|down',
            "id" => "integer|required"
        ]);
        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate->errors()->first());
        }
        $className = "App\Models\\" . ucfirst($request->model);
        $element = new $className();
        $current = $element->whereId($request->id)->first();
        $upTargetOrder = $request->type === 'up' ? $current->order - 1 : $current->order + 1;
        $downTargetOrder = $request->type === 'down' ? $current->order + 1 : $current->order - 1;
        if ($upTargetOrder > 0 && $request->type === 'up') {
            $others = $element->where(
                'order',
                '!=',
                $current->order,
            )->where('order', '>=', $upTargetOrder)->orderBy('order', 'asc')->get();
            $current->update(['order' => $upTargetOrder]);
            foreach ($others as  $other) {
                $other->update([
                    'order' => $other->order === $upTargetOrder  ? $other->order + 1  : $other->order
                ]);
            }
        }
        if ($downTargetOrder > 0 && $request->type === 'down') {
            $others = $element->where(
                'order',
                '!=',
                $element->order,
            )->where('order', '<=', $upTargetOrder)->orderBy('order', 'asc')->get();
            $current->update(['order' => $upTargetOrder]);
            foreach ($others as  $other) {
                $other->update([
                    'order' => $other->order === $upTargetOrder  ? $other->order - 1  : $other->order
                ]);
            }
        }
        return redirect()->back();
    }



    public function toggleOnHome(Request $request)
    {
        $className = '\App\Models\\' . Str::title($request->model);
        $element = new $className();
        $element = $element->withoutGlobalScopes()->whereId($request->id)->first();
        if (isset($element->on_home)) {
            $element->update([
                'on_home' => !$element->on_home
            ]);
            return redirect()->back()->with('success', 'updated Success');
        }
        return redirect()->back()->with('error', 'Process Failure .. no such thing');
    }


    public function uploadImages(Request $request)
    {
        try {
            $validate = validator($request->all(), [
                'images' => 'array|required|between:0,3',
                'model' => 'string|required',
                'id' => 'integer'
            ]);
            if ($validate->fails()) {
                return response()->json(['message' => $validate->errors()->first()]);
            }
            $className = 'App\Models\\' . ucfirst($request->model);
            $element = new $className();
            if ($request->id) {
                $element = $element->whereId($request->id)->with('images')->first();
            } else {
                $element = $element->latest()->first();
            }
            //            $request->has('images') ? $this->saveGallery($element, $request, 'images', ['1500', '1080'], false) : null;;
            $result = $request->has('images') ? $this->saveGallery($element, $request, 'images', ['1080', '1440'], false) : null;
            return response()->json(['message' => trans('general.process_success')], 200);
        } catch (\Exception $e) {
            // return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function trashed(Request $request)
    {
        $validate = validator($request->all(), [
            'model' => 'string|required',
        ]);
        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate->errors()->first());
        }
        $model = request()->model;
        $className = 'App\Models\\' . ucfirst($request->model);
        $element = new $className();
        $elements = $element->onlyTrashed()->paginate(Self::TAKE_LESS);
        return inertia('Backend/Trashed/TrashedIndex', compact('elements', 'model'));
    }

    public function restore(Request $request)
    {
        $validate = validator($request->all(), [
            'model' => 'string|required',
            'id' => 'integer|required'
        ]);
        if ($validate->fails()) {
            return redirect()->back()->withErrors($validate->errors()->first());
        }
        $className = 'App\Models\\' . ucfirst($request->model);
        $element = new $className();
        $element = $element->withTrashed()->whereId($request->id)->first();
        if ($element->trashed()) {
            $element->restore();
        }
        return redirect()->back()->with('success', trans('general.progress_success'));
    }

    
}
