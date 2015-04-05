from fabric.state import env
from fabric.operations import run, sudo
from fabric.contrib.files import exists, cd
from fabric.decorators import task, roles
from fabtools import require
import os


env.user = 'ubuntu'
env.home = '/home/' + env.user
env.deploy_key_path = env.home + '/.ssh/snake-github.pem'
env.shell = '/bin/bash -l -i -c'
env.roledefs.update({
    'web': ['alankang.com'],
})
env.key_filename = '/Users/alankang/.ssh/certs/alankang-com.pem'


@task()
@roles('web')
def deploy():
    checkout('git@github.com:akngs/snake.git', '%s/prjs' % env.home, 'snake')
    require.files.template_file('%s/prjs/snake/djangohome/snake/settings_production.py' % env.home, template_source='djangohome/snake/settings_production.py', context=env)
    with cd('%s/prjs/snake' % env.home):
        run('make product')

    require.files.template_file('/etc/supervisor/conf.d/snake.conf', template_source='_ops/supervisord.conf', context=env, use_sudo=True)
    require.files.template_file('/etc/nginx/sites-available/snake', template_source='_ops/nginx.conf', context=env, use_sudo=True)
    sudo('ln -f -s /etc/nginx/sites-available/snake /etc/nginx/sites-enabled/snake')
    restart()


@task()
@roles('web')
def restart():
    sudo('service supervisor restart')
    sudo('service nginx reload')


def checkout(url, workdir, name):
    if not exists(env.deploy_key_path):
        run('mkdir -p %s/.ssh' % env.home)
        require.file(env.home + '/.ssh/config', source='_ops/ssh_config')
        require.file(env.deploy_key_path, source='/Users/alankang/.ssh/id_rsa')
        run('chmod 0600 ' + env.deploy_key_path)

    if exists(os.path.join(workdir, name)):
        with cd(os.path.join(workdir, name)):
            run("ssh-agent bash -c 'ssh-add %s; git pull'" % env.deploy_key_path)
    else:
        with cd(workdir):
            run("ssh-agent bash -c 'ssh-add %s; git clone %s %s'" % (env.deploy_key_path, url, name))
