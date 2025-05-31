<?php

namespace App\Http\Middleware;

class ValidateRequest
{
    /**
     * Validate the request data against the given rules
     *
     * @param array $data The request data to validate
     * @param array $rules The validation rules
     * @return array Array with validation status and errors if any
     */
    public static function validate($data, $rules)
    {
        $errors = [];

        foreach ($rules as $field => $rule) {
            $ruleArray = explode('|', $rule);
            
            foreach ($ruleArray as $singleRule) {
                if (strpos($singleRule, ':') !== false) {
                    [$ruleName, $ruleValue] = explode(':', $singleRule);
                } else {
                    $ruleName = $singleRule;
                    $ruleValue = null;
                }

                switch ($ruleName) {
                    case 'required':
                        if (!isset($data[$field]) || empty($data[$field])) {
                            $errors[$field][] = "The {$field} field is required.";
                        }
                        break;

                    case 'integer':
                        if (isset($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_INT)) {
                            $errors[$field][] = "The {$field} must be an integer.";
                        }
                        break;

                    case 'numeric':
                        if (isset($data[$field]) && !is_numeric($data[$field])) {
                            $errors[$field][] = "The {$field} must be numeric.";
                        }
                        break;

                    case 'min':
                        if (isset($data[$field]) && $data[$field] < $ruleValue) {
                            $errors[$field][] = "The {$field} must be at least {$ruleValue}.";
                        }
                        break;

                    case 'date':
                        if (isset($data[$field]) && strtotime($data[$field]) === false) {
                            $errors[$field][] = "The {$field} must be a valid date.";
                        }
                        break;

                    case 'array':
                        if (isset($data[$field]) && !is_array($data[$field])) {
                            $errors[$field][] = "The {$field} must be an array.";
                        }
                        break;
                }
            }
        }

        return [
            'isValid' => empty($errors),
            'errors' => $errors
        ];
    }
}
