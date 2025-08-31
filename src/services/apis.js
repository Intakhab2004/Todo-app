const BASE_URL = import.meta.env.VITE_BASE_URL;

export const auth = {
    SIGNUP_API: BASE_URL + "/user/sign-up",
    LOGIN_API: BASE_URL + "/user/sign-in",
    VERIFY_CODE_API: BASE_URL + "/user/verify-code"
}

export const task = {
    CREATE_TASK_API: BASE_URL + "/task/create-task",
    EDIT_TASK_API: BASE_URL + "/task/edit-task",
    COMPLETE_TASK_API: BASE_URL + "/task/complete-task",
    DELETE_TASK_API: BASE_URL + "/task/delete-task",

    GET_TASK_API: BASE_URL + "/task/user-task",

    CREATE_SUBTASK_API: BASE_URL + "/task/create-subtask",
    COMPLETE_SUBTASK_API: BASE_URL + "/task/complete-subtask",
}

export const category = {
    CREATE_CATEGORY: BASE_URL + "/category/create-category",
    GET_CATEGORY: BASE_URL + "/category/get-category",
}