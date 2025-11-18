import React, { useState, useEffect, useRef, ChangeEvent } from "react";


const timeout = setTimeout(tryFocus, 100);
return () => clearTimeout(timeout);
}, []);


const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(value);
};


const handleVerify = () => {
    if (validateCode(code)) console.log("Código válido");
    else console.log("Código inválido");
};


const boxes = code.split("");


return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center relative">
                    <h1 className="text-2xl font-bold mb-2" style={{ color: ACCENT_COLOR }}>Verifica tu código</h1>
                    <p className="text-gray-500 mb-6">Hemos enviado un código de 6 dígitos a tu correo.</p>


                    <input
                        ref={hiddenInputRef}
                        type="text"
                        value={code}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        aria-label="Código de verificación"
                        className="absolute opacity-0 pointer-events-none"
                    />


                    <div className="grid grid-cols-6 gap-2 justify-center mb-6 cursor-text" onClick={() => hiddenInputRef.current?.focus()}>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-12 flex items-center justify-center rounded-xl border text-xl font-semibold bg-white"
                                style={{ borderColor: ACCENT_COLOR }}
                            >
                                {boxes[i] || ""}
                            </div>
                        ))}
                    </div>


                    <Button className="w-full text-white" style={{ backgroundColor: ACCENT_COLOR }} onClick={handleVerify}>
                        Verificar código
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    </div>
);
};