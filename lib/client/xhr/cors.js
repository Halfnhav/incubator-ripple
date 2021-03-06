/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
var helpers = ripple('xhr/helpers'),
    constants = ripple('constants'),
    XHR = ripple('xhr/base');

function _XMLHttpRequest() {
    var xhr = new XHR(),
        origMethods = {
            setRequestHeader: xhr.setRequestHeader,
            open: xhr.open
        };

    xhr.setRequestHeader = function (header) {
        // This is done to get around jQuery 1.3.2 setting a header that it shouldn't
        if (header && header.toUpperCase() !== "X-REQUESTED-WITH") {
            origMethods.setRequestHeader.apply(xhr, Array.prototype.slice.call(arguments));
        }
    };

    xhr.open = function (method, url) {
        var isSameOriginRequest = helpers.isSameOriginRequest(url);

        if (!isSameOriginRequest) {
            url = (helpers.proxyIsRemote() ? constants.API_URL : helpers.localProxyRoute()) +
                    "/xhr_proxy?tinyhippos_apikey=ABC&tinyhippos_rurl=" + escape(url);

        }

        origMethods.open.apply(xhr, Array.prototype.slice.call(arguments));

        if (!isSameOriginRequest) {
            xhr.setRequestHeader("X-Ripple-User-Agent", navigator.userAgent);
        }
    };

    return xhr;
}

module.exports = _XMLHttpRequest;
