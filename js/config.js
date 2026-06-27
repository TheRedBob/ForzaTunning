export const UI_CONFIG = {
    order: ['tires', 'geometry', 'arb', 'springs', 'damping', 'aero', 'brakes'],

    tires: {
        id: 'tires',
        label: 'Ciśnienie (P/T)',
        tooltip: 'Przód: Zmniejszenie ciśnienia zwiększa powierzchnię styku i przyczepność, ale opona szybciej się przegrzewa.\n\nTył: Zwiększenie ciśnienia usztywnia oponę, dając lepszą reakcję i stabilność, ale zmniejsza przyczepność mechaniczną.',
        format: (s) => `${s.front.toFixed(1)} / ${s.rear.toFixed(1)}`,
        unit: 'bar'
    },
    geometry: {
        id: 'geometry-',
        label: 'Geometria (Camber / Toe)',
        tooltip: 'Camber: Większy negatyw poprawia przyczepność w zakrętach.\n\nToe: Zbieżność (in) poprawia stabilność, rozbieżność (out) zwiększa reakcję na skręt.',
        format: (s) => `C: ${s.camberFront}/${s.camberRear}<br>T: ${s.toeFront}/${s.toeRear}`
    },
    arb: {
        id: 'arb',
        label: 'Sztywność (P/T)',
        tooltip: 'Przód: Usztywnienie zwiększa podsterowność.\n\nTył: Usztywnienie zwiększa nadsterowność, pomagając w szybszej zmianie kierunku.',
        format: (s) => `${s.front} / ${s.rear}`
    },
    springs: {
        id: 'springs',
        label: 'Resory (Twardość / Wys.)',
        tooltip: 'Przód: Ogranicza nurkowanie przy hamowaniu.\n\nTył: Zmniejsza przysiad przy starcie i poprawia stabilność w szybkich łukach.',
        format: (s) => `${s.front}/${s.rear} KGF/MM`
    },
    damping: {
        id: 'damping',
        label: 'Tłumienie (Reb / Bump)',
        tooltip: 'Rebound: Stabilizuje auto przy zmianach masy.\n\nBump: Poprawia precyzję przy szybkim obciążeniu.',
        format: (s) => `Reb: ${s.reboundFront}/${s.reboundRear}<br>Bump: ${s.bumpFront}/${s.bumpRear}`
    },
    aero: {
        id: 'aero',
        label: 'Balans Aero',
        tooltip: 'Przód: Zwiększa docisk w zakrętach.\n\nTył: Poprawia stabilność przy wysokich prędkościach.',
        format: (s) => `${s.balance}`
    },
    brakes: {
        id: 'brakes',
        label: 'Hamulce (Balans / Ciśnienie)',
        tooltip: 'Ustawienie balansu hamulców zmienia rozkład siły hamowania między osiami.',
        format: (s) => `${s.bias}% / ${s.pressure}%`
    }
};