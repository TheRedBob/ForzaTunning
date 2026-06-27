export const TIRE_CONFIG = {
    // Bazowe ciśnienia wyciągnięte ze środka przedziałów z forza.guide
    basePressures: {
        slick: 2.05,       // (1.9 – 2.2)
        semislick: 1.95,   // (1.9 – 2)
        stock_street_rally: 1.75, // (1.7 – 1.8)
        offroad: 1.25,     // (1.1 – 1.4)
    },
    // Parametry korekty wagi
    weight: {
        referenceKg: 1300,
        scalingFactor: 0.0001
    },
    // Mnożnik wpływu rozkładu masy na opony
    distributionFactor: 0.2,
    // Korekty ciśnienia (przód / tył) w zależności od rodzaju napędu
    drivetrainAdjustments: {
        fwd: { front: 0.1, rear: 0.2 },
        rwd: { front: 0.0, rear: 0.1 },
        awd: { front: -0.1, rear: 0.1 }
    }
};

export const CATEGORIES = {
    tires: {
        id: 'tires',
        label: 'Opony'
    },
    geometry: {
        id: 'geometry',
        label: 'Geometria'
    },
    arb: {
        id: 'arb',
        label: 'Stabilizatory'
    },
    springs: {
        id: 'springs',
        label: 'Resory'
    },
    damping: {
        id: 'damping',
        label: 'Tłumienie'
    },
    aero: {
        id: 'aero',
        label: 'Aerodynamika'
    },
    brakes: {
        id: 'brakes',
        label: 'Hamulce'
    },
    diff: {
        id: 'diff',
        label: 'Mechanizm Różnicowy'
    }
}

export const UI_CONFIG = {
    order: ['tiresPreasure', 'geometryCamber',
        'geometryToe', 'geometryCaster', 'arb',
        'springs', 'dampingReb', 'dampingBump',
        'aero', 'brakes', 'diff'],

    tiresPreasure: {
        id: 'tiresPreasure',
        category: 'tires',
        label: 'Ciśnienie (P/T)',
        tooltip: 'Przód: Zmniejszenie ciśnienia zwiększa powierzchnię styku i przyczepność, ale opona szybciej się przegrzewa.\n\nTył: Zwiększenie ciśnienia usztywnia oponę, dając lepszą reakcję i stabilność, ale zmniejsza przyczepność mechaniczną.',
        format: (s) => `${s.front.toFixed(1)} / ${s.rear.toFixed(1)}`,
        unit: 'bar'
    },
    geometryCamber: {
        id: 'geometryCamber',
        category: 'geometry',
        label: 'Kat pochylenia koła',
        tooltip: 'Większy negatyw poprawia przyczepność w zakrętach.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: '°'
    },
    geometryToe: {
        id: 'geometryToe',
        category: 'geometry',
        label: 'Zbierzność',
        tooltip: 'Zbieżność (in) poprawia stabilność, rozbieżność (out) zwiększa reakcję na skręt.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: '°'
    },
    geometryCaster: {
        id: 'geometryCaster',
        category: 'geometry',
        label: 'Kąt sworznia zwrotnicy',
        tooltip: 'Kąt skrętu wpływa na reakcję kierownicy i stabilność pojazdu.',
        format: (s) => `${s.front}`,
        unit: '°'
    },
    arb: {
        id: 'arb',
        category: 'arb',
        label: 'Sztywność (P/T)',
        tooltip: 'Przód: Usztywnienie zwiększa podsterowność.\n\nTył: Usztywnienie zwiększa nadsterowność, pomagając w szybszej zmianie kierunku.',
        format: (s) => `${s.front} / ${s.rear}`,
        unit: ''
    },
    springs: {
        id: 'springs',
        category: 'springs',
        label: 'Resory (Twardość / Wys.)',
        tooltip: 'Przód: Ogranicza nurkowanie przy hamowaniu.\n\nTył: Zmniejsza przysiad przy starcie i poprawia stabilność w szybkich łukach.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: 'KGF/MM'
    },
    dampingReb: {
        id: 'dampingReb',
        category: 'damping',
        label: 'Sztywność podczas odbicia',
        tooltip: 'Rebound: Stabilizuje auto przy zmianach masy.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: ''
    },
    dampingBump: {
        id: 'dampingBump',
        category: 'damping',
        label: 'Sztywność na wybojach',
        tooltip: 'Poprawia precyzję przy szybkim obciążeniu.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: ''
    },
    aero: {
        id: 'aero',
        category: 'aero',
        label: 'Areodynamika (P/T)',
        tooltip: 'Przód: Zwiększa docisk w zakrętach.\n\nTył: Poprawia stabilność przy wysokich prędkościach.',
        format: (s) => `${s.front}/${s.rear}`,
        unit: 'KGF'
    },
    brakes: {
        id: 'brakes',
        label: 'Hamulce (Balans / Ciśnienie)',
        category: 'brakes',
        tooltip: 'Ustawienie balansu hamulców zmienia rozkład siły hamowania między osiami.',
        format: (s) => `${s.bias}% / ${s.pressure}%`,
        unit: ''
    },
    diff: {
        id: 'diff',
        category: 'diff',
        label: 'Przyspieszenie / Zwalnianie',
        tooltip: 'AWD posiada ustawienia dla przodu, tyłu i balansu centralnego.\nRWD to tylko tył, a FWD to tylko przód.\n\nZwiększenie przyspieszenia poprawia wyjście z zakrętu, ale wymaga lepszej kontroli gazu.',
        format: (s) => {
            if (s.type === 'awd') {
                return `P: ${s.frontAccel}/${s.frontDecel}% | T: ${s.rearAccel}/${s.rearDecel}% | C: ${s.center}%`;
            }
            if (s.type === 'rwd') {
                return `Tył: ${s.rearAccel}% / ${s.rearDecel}%`;
            }
            if (s.type === 'fwd') {
                return `Przód: ${s.frontAccel}% / ${s.frontDecel}%`;
            }
            return '--';
        },
        unit: ''
    }
};

