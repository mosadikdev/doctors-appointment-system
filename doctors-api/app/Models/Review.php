<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'rating',
        'comment',
        'status' 
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    protected $appends = [
        'patient_name',
        'formatted_date'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function getPatientNameAttribute()
    {
        return $this->patient->name ?? 'Anonymous';
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeForDoctor($query, $doctorId)
    {
        return $query->where('doctor_id', $doctorId);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}