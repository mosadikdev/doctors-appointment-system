<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'gender',
        'city',
        'specialty',
        'photo_url'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Gender constants
    const GENDER_MALE = 'male';
    const GENDER_FEMALE = 'female';

    public static function getGenders()
    {
        return [
            self::GENDER_MALE => 'Male',
            self::GENDER_FEMALE => 'Female',
        ];
    }

    // Role constants
    const ROLE_ADMIN = 'admin';
    const ROLE_DOCTOR = 'doctor';
    const ROLE_PATIENT = 'patient';

    public static function getRoles()
    {
        return [
            self::ROLE_ADMIN => 'Administrator',
            self::ROLE_DOCTOR => 'Doctor',
            self::ROLE_PATIENT => 'Patient'
        ];
    }

    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isDoctor()
    {
        return $this->role === self::ROLE_DOCTOR;
    }

    public function isPatient()
    {
        return $this->role === self::ROLE_PATIENT;
    }

    /**
     * Get the doctor this user belongs to (for patients)
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    /**
     * Get patients associated with this doctor
     */
    public function patients()
    {
        return $this->hasMany(User::class, 'doctor_id');
    }

    /**
     * Get availability slots for this doctor
     */
    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }

    /**
     * Get doctors bookmarked by this patient
     */
    public function bookmarkedDoctors()
    {
        return $this->belongsToMany(
            User::class, 
            'patient_doctor_bookmarks', 
            'patient_id', 
            'doctor_id'
        )->where('role', self::ROLE_DOCTOR);
    }

    /**
     * Get appointments for this user (as patient or doctor)
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    /**
     * Get doctor's reviews
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'doctor_id');
    }

    /**
     * Get the URL for the user's profile photo
     */
    public function getPhotoUrlAttribute($value)
{
    if (!$value) return null;
    
    if (filter_var($value, FILTER_VALIDATE_URL)) {
        return $value;
    }
    
    return url('storage/' . $value);
}

    /**
     * Scope for doctors only
     */
    public function scopeDoctors($query)
    {
        return $query->where('role', self::ROLE_DOCTOR);
    }

    /**
     * Scope for patients only
     */
    public function scopePatients($query)
    {
        return $query->where('role', self::ROLE_PATIENT);
    }

    /**
     * Get formatted phone number
     */
    public function getFormattedPhoneAttribute()
    {
        if (empty($this->phone)) {
            return null;
        }
        
        // Simple formatting - customize based on your needs
        return preg_replace('/(\d{3})(\d{3})(\d{4})/', '($1) $2-$3', $this->phone);
    }
}