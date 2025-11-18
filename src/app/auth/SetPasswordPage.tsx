import React, { useState } from "react";
const [password, setPassword] = useState<string>("");
const [confirm, setConfirm] = useState<string>("");
const [showPass, setShowPass] = useState<boolean>(false);
const [showConfirm, setShowConfirm] = useState<boolean>(false);
const [error, setError] = useState<string>("");


const validations: PasswordValidation = validatePassword(password);
const canSubmit = validations.length && validations.upper && validations.number && passwordsMatch(password, confirm);


const handleSubmit = (): void => {
    if (!validations.length || !validations.upper || !validations.number) {
        setError("La contraseña no cumple los requisitos mínimos.");
        return;
    }
    if (!passwordsMatch(password, confirm)) {
        setError("Las contraseñas no coinciden.");
        return;
    }


    console.log("Contraseña creada correctamente. Redirigir al dashboard (editar ruta).");
    // window.location.href = '/ruta-a-tu-dashboard'; // editar ruta
};


return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: "#5A3CF4" }}>Crea tu contraseña</h1>
                    <p className="text-gray-500 text-center mb-6">Configura una nueva contraseña para tu cuenta.</p>


                    <div className="mb-4">
                        <label className="font-semibold block mb-2">Contraseña</label>
                        <div className="relative">
                            <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" aria-label="Contraseña" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">{showPass ? "🙈" : "👁️"}</button>
                        </div>
                    </div>


                    <div className="mb-6">
                        <label className="font-semibold block mb-2">Confirmar contraseña</label>
                        <div className="relative">
                            <Input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pr-10" aria-label="Confirmar contraseña" />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">{showConfirm ? "🙈" : "👁️"}</button>
                        </div>
                    </div>


                    <ul className="text-sm mb-4">
                        <li className={validations.length ? "text-green-600" : "text-gray-400"}>• Mínimo 8 caracteres</li>
                        <li className={validations.upper ? "text-green-600" : "text-gray-400"}>• Una mayúscula</li>
                        <li className={validations.number ? "text-green-600" : "text-gray-400"}>• Un número</li>
                    </ul>


                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}


                    <Button className="w-full text-white mb-2" style={{ backgroundColor: "#5A3CF4" }} onClick={handleSubmit} disabled={!canSubmit}>
                        Crear contraseña
                    </Button>


                    <p className="text-xs text-center text-gray-500 mt-3">* Edita la línea con window.location.href para redirigir al dashboard.</p>
                </CardContent>
            </Card>
        </motion.div>
    </div>
);
};