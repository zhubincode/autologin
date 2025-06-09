import React from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`
          relative w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border
          transform transition-all duration-300 ease-out
          animate-scale-in overflow-hidden
          ${
            darkMode
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-gray-200"
          }
        `}
      >
        {/* 内部滚动容器 */}
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* 头部 */}
          <div
            className={`sticky top-0 z-10 p-6 border-b backdrop-blur-sm bg-opacity-90 ${
              darkMode
                ? "border-slate-600 bg-slate-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  使用帮助
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-8">
            {/* 快速开始 */}
            <section>
              <h3
                className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">🚀</span>
                <span>快速开始</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    step: "1",
                    title: "选择配置",
                    desc: "在已登录的浏览器中选择合适的配置模式",
                    icon: "⚙️",
                  },
                  {
                    step: "2",
                    title: "生成代码",
                    desc: "点击生成按钮，系统自动提取登录数据",
                    icon: "🔧",
                  },
                  {
                    step: "3",
                    title: "执行代码A",
                    desc: "在源浏览器控制台（F12）执行代码A",
                    icon: "💻",
                  },
                  {
                    step: "4",
                    title: "获取代码B",
                    desc: "执行后自动生成代码B并复制到剪贴板",
                    icon: "📋",
                  },
                  {
                    step: "5",
                    title: "注入登录态",
                    desc: "在目标浏览器控制台粘贴执行代码B",
                    icon: "🎯",
                  },
                  {
                    step: "6",
                    title: "完成迁移",
                    desc: "刷新页面查看登录效果",
                    icon: "✅",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      darkMode
                        ? "bg-slate-700/50 border-slate-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </span>
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 配置模式说明 */}
            <section>
              <h3
                className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">🔧</span>
                <span>配置模式说明</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-lg border-2 border-dashed transition-all ${
                    darkMode
                      ? "border-blue-400/50 bg-blue-900/20"
                      : "border-blue-300 bg-blue-50"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">🚀</span>
                    <h4
                      className={`text-lg font-semibold ${
                        darkMode ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      万能模式
                    </h4>
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    提取所有localStorage和Cookie数据，适用于复杂登录系统。数据量大但覆盖全面，自动使用三种复制方式确保成功。
                  </p>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    ✅ 推荐用于不确定登录机制的网站
                    <br />
                    ✅ 覆盖面最广，成功率最高
                    <br />
                    ⚠️ 数据量较大，传输时间稍长
                  </div>
                </div>

                <div
                  className={`p-6 rounded-lg border-2 border-dashed transition-all ${
                    darkMode
                      ? "border-green-400/50 bg-green-900/20"
                      : "border-green-300 bg-green-50"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">🎯</span>
                    <h4
                      className={`text-lg font-semibold ${
                        darkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      单项模式
                    </h4>
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    只提取指定的token、用户信息或会话ID，数据量小，传输快速。适用于已知登录机制的网站。
                  </p>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ✅ 数据量小，传输快速
                    <br />
                    ✅ 精确提取，避免冗余
                    <br />
                    ⚠️ 需要了解网站的登录机制
                  </div>
                </div>
              </div>
            </section>

            {/* 实际应用场景 */}
            <section>
              <h3
                className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">🎯</span>
                <span>实际应用场景</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: "👥",
                    title: "团队协作项目",
                    desc: "在团队协作项目中，需要共享个人账号给团队成员使用",
                    examples: [
                      "设计协作平台（Figma、Sketch）",
                      "项目管理工具（Jira、Trello）",
                      "开发工具（GitLab、Jenkins）",
                    ],
                    color: "blue",
                  },
                  {
                    icon: "🔧",
                    title: "多环境开发测试",
                    desc: "开发人员需要在不同浏览器中测试同一账号的功能",
                    examples: [
                      "Chrome开发环境迁移到Firefox测试",
                      "Safari验证移动端适配",
                      "跨浏览器兼容性测试",
                    ],
                    color: "green",
                  },
                  {
                    icon: "🎪",
                    title: "客户演示支持",
                    desc: "销售或技术支持需要在客户面前演示产品功能",
                    examples: [
                      "提前准备演示账号",
                      "现场快速注入登录状态",
                      "确保演示流畅进行",
                    ],
                    color: "purple",
                  },
                  {
                    icon: "💼",
                    title: "跨设备办公",
                    desc: "在家办公和公司办公需要在不同设备间同步工作状态",
                    examples: [
                      "公司电脑提取登录状态",
                      "家庭设备快速恢复工作环境",
                      "支持多平台状态同步",
                    ],
                    color: "orange",
                  },
                  {
                    icon: "🚨",
                    title: "紧急故障处理",
                    desc: "系统出现故障，需要紧急在其他设备上登录处理",
                    examples: [
                      "快速提取管理员登录状态",
                      "备用设备立即获得管理权限",
                      "缩短故障处理时间",
                    ],
                    color: "red",
                  },
                  {
                    icon: "📚",
                    title: "培训和教学",
                    desc: "讲师需要在多个设备上演示相同的操作流程",
                    examples: [
                      "主设备准备教学账号",
                      "学员设备快速同步登录",
                      "确保教学演示连贯性",
                    ],
                    color: "indigo",
                  },
                ].map((scenario, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-lg border transition-all hover:shadow-lg hover:scale-105 ${
                      darkMode
                        ? "bg-slate-700/50 border-slate-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{scenario.icon}</span>
                      <h4
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {scenario.title}
                      </h4>
                    </div>
                    <p
                      className={`text-sm mb-3 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {scenario.desc}
                    </p>
                    <div className="space-y-1">
                      {scenario.examples.map((example, i) => (
                        <div
                          key={i}
                          className={`text-xs flex items-center space-x-2 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-${scenario.color}-500`}
                          ></span>
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 安全提示 */}
            <section>
              <h3
                className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">🔒</span>
                <span>安全提示</span>
              </h3>
              <div
                className={`p-6 rounded-lg border-l-4 border-yellow-500 ${
                  darkMode ? "bg-yellow-900/20" : "bg-yellow-50"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4
                      className={`font-semibold mb-2 text-yellow-700 dark:text-yellow-300`}
                    >
                      ✅ 安全特性
                    </h4>
                    <ul
                      className={`text-sm space-y-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <li>• 本地处理，数据不上传服务器</li>
                      <li>• 代码执行完毕后自动清理</li>
                      <li>• 支持HTTPS环境下使用</li>
                      <li>• 开源透明，可审查代码</li>
                    </ul>
                  </div>
                  <div>
                    <h4
                      className={`font-semibold mb-2 text-yellow-700 dark:text-yellow-300`}
                    >
                      ⚠️ 注意事项
                    </h4>
                    <ul
                      className={`text-sm space-y-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <li>• 避免在公共网络中传输敏感数据</li>
                      <li>• 仅在信任的设备上使用</li>
                      <li>• 定期更新密码保障账号安全</li>
                      <li>• 不要在不安全的环境下使用</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 常见问题 */}
            <section>
              <h3
                className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">❓</span>
                <span>常见问题</span>
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "为什么执行代码A后没有生成代码B？",
                    a: "请确保在已登录的浏览器中执行代码A，并检查控制台是否有错误信息。某些网站可能有安全限制，建议尝试万能模式。",
                  },
                  {
                    q: "代码B执行后为什么还是没有登录？",
                    a: "请刷新页面查看效果。部分网站需要重新加载才能识别新的登录状态。如果仍然无效，可能是网站的登录机制发生了变化。",
                  },
                  {
                    q: "可以在移动设备上使用吗？",
                    a: "理论上支持，但移动浏览器的控制台操作较为复杂。建议在桌面浏览器中使用以获得最佳体验。",
                  },
                  {
                    q: "支持哪些网站？",
                    a: "支持大部分使用标准登录机制的网站。对于使用复杂加密或特殊认证的网站，可能需要使用万能模式或自定义配置。",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      darkMode
                        ? "bg-slate-700/30 border-slate-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Q: {faq.q}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      A: {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 底部 */}
          <div
            className={`sticky bottom-0 p-6 border-t backdrop-blur-sm bg-opacity-90 ${
              darkMode
                ? "border-slate-600 bg-slate-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                💡 提示：按 ESC 键或点击外部区域可关闭此帮助窗口
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
