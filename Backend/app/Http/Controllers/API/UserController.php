<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Crypt;

class UserController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $data = User::all();

        return response()->json([
            'message' => 'Successfully Fetch Data User',
            'data' => $data
        ], Response::HTTP_OK);
    }

    public function store(UserStoreRequest $request): JsonResponse
    {
        try {
            $data = User::create($request->all());

            return response()->json([
                'message' => 'Successfully Create New User',
                'data' => $data,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ]);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $data = User::findOrFail($id);

            if (empty($data)) {
                return response()->json([
                    'message' => 'User not found!'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'message' => 'Successfully Fetch User Detail',
                'data' => $data,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(UserUpdateRequest $request, $id): JsonResponse
    {
        try {
            $data = User::findOrFail($id);

            if (empty($data)) {
                return response()->json([
                    'message' => 'User not found!'
                ], Response::HTTP_NOT_FOUND);
            }

            $data->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password) ?? $data->password
            ]);

            return response()->json([
                'message' => 'Successfully Update User',
                'data' => $data,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $data = User::findOrFail($id);

            if (empty($data)) {
                return response()->json([
                    'message' => 'User not found!'
                ], Response::HTTP_NOT_FOUND);
            }

            $data->delete();

            return response()->json([
                'message' => 'Successfully Delete User',
                'data' => $data,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
