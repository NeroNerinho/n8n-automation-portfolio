import DOMPurify from 'dompurify'

export const useSecurity = () => {
    const sanitize = (dirty: string) => {
        return DOMPurify.sanitize(dirty)
    }

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const validateInput = (input: string, maxLength: number = 1000) => {
        if (!input) return true
        if (input.length > maxLength) return false
        // Basic SQL injection prevention (though handled by ORM/Backend usually)
        const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|GRANT|ALTER|UNION|TRUNCATE)\b)/i
        if (sqlPattern.test(input)) return false
        return true
    }

    return {
        sanitize,
        validateEmail,
        validateInput
    }
}
