import bcrypt from 'bcryptjs';

/**
 * Utilitários para gerenciamento de senhas
 */
export class PasswordUtils {
    /**
     * Gerar hash da senha
     */
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    /**
     * Verificar se a senha está correta
     */
    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Gerar senha temporária segura
     */
    static generateTemporaryPassword(length: number = 12): string {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lowercase = 'abcdefghijkmnpqrstuvwxyz';
        const numbers = '23456789';
        const symbols = '!@#$%&*';

        const allChars = uppercase + lowercase + numbers + symbols;
        let password = '';

        // Garantir pelo menos um de cada tipo
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        // Completar o resto aleatoriamente
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Embaralhar a senha
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Validar força da senha
     */
    static validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
        score: number;
    } {
        const errors: string[] = [];
        let score = 0;

        // Verificações básicas
        if (password.length < 8) {
            errors.push('Senha deve ter pelo menos 8 caracteres');
        } else {
            score += 1;
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra minúscula');
        } else {
            score += 1;
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra maiúscula');
        } else {
            score += 1;
        }

        if (!/\d/.test(password)) {
            errors.push('Senha deve conter pelo menos um número');
        } else {
            score += 1;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Senha deve conter pelo menos um caractere especial');
        } else {
            score += 1;
        }

        // Verificações avançadas
        if (password.length >= 12) score += 1;
        if (/(.)\1{2,}/.test(password)) {
            errors.push('Senha não deve ter caracteres repetidos consecutivos');
            score -= 1;
        }

        return {
            isValid: errors.length === 0,
            errors,
            score: Math.max(0, score)
        };
    }
}