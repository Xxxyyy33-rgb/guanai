/**
 * 预警办理 · 双端共用选项常量
 * 详见《预警办理交互规范》§3 字段表
 *
 * 使用方式：在 HTML 中引入：
 *   <script src="alert-options.js"></script>
 * 然后通过 window.ALERT_OPTIONS 访问
 */
(function (global) {
  // 4 个主题元数据：颜色、文案、配套帮扶名称
  const MOD_META = {
    late: {
      text: '行为护航',
      avatarCls: 'bg-orange-50 text-orange-500',
      tagCls: 'bg-orange-100 text-orange-600',
      helpName: '归巢帮扶申请',
    },
    study: {
      text: '学业护航',
      avatarCls: 'bg-green-50 text-green-600',
      tagCls: 'bg-green-100 text-green-600',
      helpName: '登高帮扶申请',
    },
    addict: {
      text: '心理护航',
      avatarCls: 'bg-purple-50 text-purple-600',
      tagCls: 'bg-purple-100 text-purple-600',
      helpName: '晨曦帮扶申请',
    },
    consume: {
      text: '经济护航',
      avatarCls: 'bg-red-50 text-red-500',
      tagCls: 'bg-red-100 text-red-600',
      helpName: '春雨帮扶申请',
    },
  };

  // verifyResult 核实结论（4 选 1）
  const VERIFY_RESULTS = [
    { value: 'true', label: '情况属实' },
    { value: 'false', label: '系统误报' },
    { value: 'known', label: '已知原因（请假/外出等）' },
    { value: 'pending', label: '需进一步核实' },
  ];

  // conclusion 办理结论（新版 · 分支化 3 选 1）
  // 设计原则：反馈+处置合并为一步，结论决定后续走向
  //   close_resolved → 直接归档（不进销号）
  //   close_false    → 直接归档·标记误报（不进销号）
  //   enroll_help    → 纳入帮扶（进帮扶列表，帮扶完成后才销号）
  const CONCLUSIONS = [
    { value: 'close_resolved', label: '关闭·情况已解决', dotCls: 'bg-green-500', desc: '已即时提醒/解决，直接归档（无需销号）', branch: 'close' },
    { value: 'close_false',    label: '关闭·系统误报',   dotCls: 'bg-gray-500',  desc: '数据/规则误判，直接归档（无需销号）', branch: 'close' },
    { value: 'enroll_help',    label: '纳入帮扶',         dotCls: 'bg-pink-500',  desc: '需持续介入，发起帮扶申请并进入帮扶列表', branch: 'help' },
  ];

  // 旧值 → 新值映射（兼容历史数据 / 旧代码）
  const CONCLUSION_LEGACY_MAP = {
    pending: 'enroll_help',
    keep:    'enroll_help',
    close:   'close_resolved',
    upgrade: 'enroll_help',
  };
  function normalizeConclusion(v) {
    if (!v) return v;
    return CONCLUSION_LEGACY_MAP[v] || v;
  }

  // helpPlan 帮扶计划（仅 conclusion=enroll_help 时使用，按主题自动匹配）
  const HELP_PLANS = {
    late:    { value: 'guichao',  label: '归巢帮扶申请', desc: '行为护航 · 晚归/缺勤等行为帮扶' },
    study:   { value: 'denggao',  label: '登高帮扶申请', desc: '学业护航 · 学业困难/挂科预警帮扶' },
    addict:  { value: 'chenxi',   label: '晨曦帮扶申请', desc: '心理护航 · 心理危机/情绪干预帮扶' },
    consume: { value: 'chunyu',   label: '春雨帮扶申请', desc: '经济护航 · 隐性资助/家庭困难帮扶' },
  };

  // followUpPlan 跟踪频率（enroll_help 时显示）
  const FOLLOWUP_PLANS = [
    { value: 'daily', label: '每日跟踪' },
    { value: 'weekly', label: '每周跟踪' },
    { value: 'monthly', label: '每月跟踪' },
    { value: 'none', label: '无需跟踪' },
  ];

  // situationTags 情况标签（按主题）
  // 行为护航 late：按用户最新规范的 9 项重写
  const SITUATION_TAGS = {
    all: ['情况属实，已知悉', '特殊情况-已请假', '身体不适就医', '实验室/图书馆', '数据误报', '其他情况'],
    late: [
      '学业原因-在校内其他地方过夜',
      '家在长沙-在校外家中过夜',
      '个人娱乐活动-在校外过夜',
      '外出就医-在医院住院',
      '流程未完成-申请请假',
      '社团排练',
      '校外实习',
      '系统误报',
      '其他',
    ],
    study: ['情况属实，学业困难', '已沟通学习计划', '身体不适请假', '课程冲突', '已主动重修', '成绩录入误差'],
    addict: ['情况属实，状态欠佳', '已联系心理咨询师', '本人否认/敷衍', '短期情绪波动', '涉及隐私需保密', 'NLP 误判'],
    consume: ['情况属实，家庭困难', '短期生活节奏变化', '已享受校外资助', '刷卡设备故障', '本人不愿透露', '数据采集滞后'],
  };

  // actionTags 处理措施（按主题）
  const ACTION_TAGS = {
    all: ['短信提醒', '电话沟通', '面对面约谈', '联系家长', '安排帮扶', '持续观察'],
    late: ['短信提醒', '电话沟通', '当面约谈', '联系家长', '宿舍长协助监督', '申请白名单', '纳入归巢帮扶', '持续观察'],
    study: ['短信督学', '电话沟通', '当面约谈', '联系任课老师', '学伴/学霸结对', '安排学业导师', '补考辅导登记', '发起登高帮扶'],
    addict: ['暖心私聊', '当面约谈', '转介心理咨询', '危机干预小组介入', '联系家长（评估后）', '宿舍密切关注', '发起晨曦帮扶', '启动 24h 守护'],
    consume: ['暖心私下沟通', '申请临时困难补助', '推荐勤工助学岗', '纳入隐性资助名单', '协调减免/缓缴', '发起春雨帮扶', '转资助中心评估'],
  };

  // 必填校验：根据 conclusion 返回必填字段及失败提示
  // 使用：const errors = ALERT_OPTIONS.validate({ verifyResult, actionTags, conclusion, followUpPlan, remark, mod, isBatch });
  function validate(payload) {
    const errs = [];
    let { verifyResult, actionTags = [], conclusion, followUpPlan, remark = '', mod, isBatch = false } = payload || {};

    // 兼容旧值
    conclusion = normalizeConclusion(conclusion);

    if (!verifyResult) errs.push({ field: 'verifyResult', msg: '请先选择核实结论' });

    if (!conclusion) errs.push({ field: 'conclusion', msg: '请选择本次办理结论' });

    // 批量场景禁止"关闭·系统误报"（须逐条说明）
    if (isBatch && conclusion === 'close_false') {
      errs.push({ field: 'conclusion', msg: '批量办理不支持「关闭·系统误报」，请逐条确认' });
    }

    // 关闭·情况已解决：必填 actionTags
    if (conclusion === 'close_resolved') {
      if (actionTags.length === 0) errs.push({ field: 'actionTags', msg: '请至少选择一项已采取的处置措施' });
    }

    // 关闭·系统误报：备注 ≥10 字
    if (conclusion === 'close_false') {
      if (remark.trim().length < 10) errs.push({ field: 'remark', msg: '判定为误报时，请在备注中说明（≥10 字）' });
    }

    // 纳入帮扶：必填 actionTags + 跟踪频率 + 备注 ≥20 字
    if (conclusion === 'enroll_help') {
      if (actionTags.length === 0) errs.push({ field: 'actionTags', msg: '请至少选择一项已采取/计划采取的措施' });
      if (!followUpPlan) errs.push({ field: 'followUpPlan', msg: '请选择帮扶跟踪频率' });
      if (remark.trim().length < 20) errs.push({ field: 'remark', msg: '纳入帮扶请在备注中详细说明背景与帮扶诉求（≥20 字）' });
    }

    // 心理主题：纳入帮扶必须含约谈/转介
    if (mod === 'addict' && conclusion === 'enroll_help') {
      const required = ['当面约谈', '转介心理咨询'];
      const hit = actionTags.some((t) => required.includes(t));
      if (!hit) errs.push({ field: 'actionTags', msg: '心理预警纳入帮扶须包含「当面约谈」或「转介心理咨询」' });
    }

    return errs;
  }

  // 根据结论判定后续走向（branch=close 直接归档不进销号；branch=help 进帮扶列表）
  function getBranch(conclusion) {
    const c = normalizeConclusion(conclusion);
    const item = CONCLUSIONS.find((x) => x.value === c);
    return item ? item.branch : null;
  }

  global.ALERT_OPTIONS = {
    MOD_META,
    VERIFY_RESULTS,
    CONCLUSIONS,
    CONCLUSION_LEGACY_MAP,
    HELP_PLANS,
    FOLLOWUP_PLANS,
    SITUATION_TAGS,
    ACTION_TAGS,
    validate,
    normalizeConclusion,
    getBranch,
  };
})(window);
