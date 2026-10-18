FROM ubuntu:24.04

# iptables -j LOG and -m owner are not in the cloud-agent kernel tested
# earlier (6.12.94+). This image does not bake those rules. The script
# copied below applies the nft dnat that did work, and environment.json
# start runs it after boot. Tinyproxy is not started during the image
# build; a build keeps disk state only.

RUN printf '#!/bin/sh\nexit 101\n' > /usr/sbin/policy-rc.d \
    && chmod 755 /usr/sbin/policy-rc.d \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        iptables \
        nftables \
        nodejs \
        npm \
        procps \
        python3 \
        python3-pip \
        redsocks \
        sudo \
        tinyproxy \
    && rm -rf /var/lib/apt/lists/* \
    && printf 'ubuntu ALL=(ALL) NOPASSWD:ALL\n' > /etc/sudoers.d/90-ubuntu-nopasswd \
    && chmod 440 /etc/sudoers.d/90-ubuntu-nopasswd

# Runtime listen/log settings. `start` rewrites an equivalent file under
# /tmp/egress and is what launches the process.
RUN cat > /etc/tinyproxy/egress-lab.conf <<'EOF'
# Generated for the egress lab image. Do not edit by hand.
# Listen on loopback only. CONNECT is logged; TLS is not decrypted.
Port 8888
Listen 127.0.0.1
Timeout 600
LogFile "/tmp/egress/proxy.log"
LogLevel Connect
PidFile "/tmp/egress/tinyproxy.pid"
MaxClients 50
Allow 127.0.0.1
Allow ::1
DisableViaHeader Yes
ConnectPort 80
ConnectPort 443
EOF

COPY egress-proxy.sh /usr/local/bin/egress-proxy.sh
RUN chmod 755 /usr/local/bin/egress-proxy.sh

# After apt, so image builds do not send package downloads through tinyproxy.
ENV HTTP_PROXY=http://127.0.0.1:8888 \
    HTTPS_PROXY=http://127.0.0.1:8888 \
    http_proxy=http://127.0.0.1:8888 \
    https_proxy=http://127.0.0.1:8888 \
    NO_PROXY=localhost,127.0.0.1 \
    no_proxy=localhost,127.0.0.1

USER ubuntu
