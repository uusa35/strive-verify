<?php

namespace App\Services\Search;

use App\Http\Resources\CategoryLightResource;
use App\Models\Tag;
use App\Models\Collection;
use App\Models\Service;
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
class UserFilters extends QueryFilters
{
    public $tag;

    public function __construct(Request $request, Tag $tag)
    {
        parent::__construct($request);
        $this->tag = $tag;
    }

    public function search($search)
    {
        return $this->builder
            ->where(DB::raw('lower(username)'), "LIKE", "%" . strtolower($search) . "%")
            ->orWhere(DB::raw('lower(name->"$.ar")'), "LIKE", "%" . strtolower($search) . "%")
            ->orWhere(DB::raw('lower(name->"$.en")'), "LIKE", "%" . strtolower($search) . "%")
            ->orWhere("email", "like", '%' . $search . '%')
            ->orWhere("nationality", "like", '%' . $search . '%')
            ->orWhere("civil_id", "like", '%' . $search . '%')
            ->orWhere("gender", "like", '%' . $search . '%');
    }

    public function gender()
    {
        return $this->builder->where('gender', request()->gender);
    }




    public function tag_id()
    {
        return $this->builder->whereHas('tags', function ($q) {
            return $q->where('tag_id', request()->tag_id);
        });
    }


    public function active()
    {
        return $this->builder->where('active', request()->active);
    }

    public function page()
    {
        return $this->builder;
    }
    public function page_id()
    {
        return $this->builder;
    }



    public function sort()
    {
        switch (request('sort')) {
            case 'name':
                return $this->builder->orderBy('name' . app()->getLocale(), 'asc');
            case 'price':
                return $this->builder->orderBy('price', request('sort'));
            default:
                return $this->builder->orderBy('name' . app()->getLocale(), 'asc');
        }
    }

    public function date_range()
    {
        return $this->builder->whereDate('start_date', '>=', Carbon::today())->whereDate('end_date', '>=', Carbon::parse(request('date_range')));
    }

    public function timing_value()
    {
        return $this->builder->whereHas('timings', function ($q) {
            return $q->whereDate('start', '>=', Carbon::parse(request('timing_id'))->format('h:i a'));
        });
    }

    // items for Translation search
    public function item($search)
    {
        return $this->builder
            ->where('ar', 'like', "%{$search}%")
            ->orWhere('en', 'like', "%{$search}%")
            ->orWhere('key', 'like', "%{$search}%");
    }

    public function role_id()
    {
        return $this->builder->where('role_id', request()->role_id);
    }

    public function role()
    {
        return $this->builder->role(request()->role);
    }
}
