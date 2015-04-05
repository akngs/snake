var state = 'intro';

function main() {
    $('#play').on('click', function() {
        $('.monitor').removeClass('state-intro').addClass('state-help');
    });
    $('#ok').on('click', function() {
        $('.monitor').removeClass('state-help').addClass('state-stage');
    });
    $('#replay').on('click', function() {
        $('.monitor').removeClass('state-gameover').addClass('state-stage');
    });
}
