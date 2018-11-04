const samples = [
    {
        name: 'Twisty lines',
        code:
`fd(-100);
up(2);
repeat(30, () => {
    fd(200);
    rt(175);
});
`
    },
    {
        name: 'Octo-coil',
        code:
`up(3);
repeat(10, () => {
    repeat(8, () => {
        fd(50);
        rt(45);
    });
});
`
    },
    {
        name: 'Back and forth square coil',
        code:
`up(6);
repeat(2, () => {
    repeat(8 * 4, () => {
        fd(70);
        rt(90);
    });
    rt(-90);
    up(-12);
    fd(20);
});
`
    }
    ];

