<?php

namespace App\Services\Search;

use App\Enums\CourseTypeEnum;
use App\Models\Tag;
use App\Models\Collection;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonInterval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Created by PhpStorm.
 * User: usamaahmed
 * Date: 2/7/17
 * Time: 8:40 AM
 */
class CourseFilters extends QueryFilters
{

    public function __construct(Request $request)
    {
        parent::__construct($request);
    }

    public function search($search)
    {
        return $this->builder
            ->where(DB::raw('lower(name_ar)'), 'LIKE', '%' . strtolower($search) . '%')
            ->where(DB::raw('lower(name_en)'), 'LIKE', '%' . strtolower($search) . '%')
            ->orWhere(DB::raw('lower(keywords)'), 'LIKE', '%' . strtolower($search) . '%')
            ->orWhere(DB::raw('lower(content_ar)'), 'LIKE', '%' . strtolower($search) . '%')
            ->orWhere(DB::raw('lower(content_en)'), 'LIKE', '%' . strtolower($search) . '%');
    }


    public function notes()
    {
        return $this->builder->where('notes', 'like', "%{request()->search}%");
    }

    public function name()
    {
        return $this->builder->where('name', 'like', "%{request()->search}%");
    }

    public function tag_id()
    {
        return $this->builder->whereHas('tags', function ($q) {
            return $q->where('tag_id', request()->tag_id);
        });
    }


    public function page()
    {
        return $this->builder;
    }

    public function page_id()
    {
        return $this->builder;
    }

    public function locale()
    {
        return $this->builder;
    }

    public function date()
    {
        return $this->builder->where('date', '=', request()->date);
    }

    public function on_home()
    {
        return $this->builder->where('on_home', request()->on_home);
    }

    public function price()
    {
        return $this->builder->where('sale_price', '<=', request()->price);
    }

    public function sort()
    {
        switch (request('sort')) {
            case 'name_asc':
                return $this->builder->orderBy('name->' . app()->getLocale(), 'asc');
            case 'name_desc':
                return $this->builder->orderBy('name->' . app()->getLocale(), 'desc');
            case 'start_date_asc':
                return $this->builder->orderBy('start_date', 'asc');
            case 'start_date_desc':
                return $this->builder->orderBy('start_date', 'desc');
            default:
                return $this->builder->orderBy('name' . app()->getLocale(), 'asc');
        }
    }
}
