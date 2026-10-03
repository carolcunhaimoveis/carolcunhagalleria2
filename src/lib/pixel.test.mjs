import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";

import { parseSuccessfulCaptureResponse } from "./lead-contract.ts";
import { initMetaPixel, isMetaPixelAllowed, trackLeadOnce } from "./pixel.ts";
import { captureUtmParams, readUtmParams } from "./utm.ts";

function installBrowser(hostname) {
  const insertBefore = mock.fn();
  const appendChild = mock.fn();
  const firstScript = { parentNode: { insertBefore } };

  globalThis.window = { location: { hostname } };
  globalThis.document = {
    createElement: mock.fn(() => ({})),
    getElementById: mock.fn(() => null),
    getElementsByTagName: mock.fn(() => [firstScript]),
    head: { appendChild },
  };
  return { insertBefore };
}

function installTrackingBrowser(url) {
  const values = new Map();
  globalThis.window = { location: { href: url } };
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("Meta Pixel", () => {
  beforeEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  });

  it("autoriza apenas o domínio publicado exato", () => {
    assert.equal(isMetaPixelAllowed("carolcunhagalleria2.lovable.app"), true);
    assert.equal(isMetaPixelAllowed("preview--carolcunhagalleria2.lovable.app"), false);
    assert.equal(isMetaPixelAllowed("localhost"), false);
    assert.equal(isMetaPixelAllowed("lovable.app"), false);
  });

  it("inicializa e envia PageView uma única vez", () => {
    const { insertBefore } = installBrowser("carolcunhagalleria2.lovable.app");
    assert.equal(initMetaPixel(), true);
    assert.equal(initMetaPixel(), true);
    assert.deepEqual(window.fbq.queue, [
      ["init", "1601525438422287"],
      ["track", "PageView"],
    ]);
    assert.equal(insertBefore.mock.callCount(), 1);
  });

  it("não inicializa nem envia eventos em preview ou desenvolvimento", () => {
    const { insertBefore } = installBrowser("localhost");
    assert.equal(initMetaPixel(), false);
    assert.equal(trackLeadOnce("lead-1"), false);
    assert.equal(window.fbq, undefined);
    assert.equal(insertBefore.mock.callCount(), 0);
  });

  it("envia exatamente um Lead por cadastro e somente após inicialização", () => {
    installBrowser("carolcunhagalleria2.lovable.app");
    assert.equal(trackLeadOnce("lead-1"), false);
    initMetaPixel();
    assert.equal(trackLeadOnce("lead-1"), true);
    assert.equal(trackLeadOnce("lead-1"), false);
    assert.deepEqual(window.fbq.queue, [
      ["init", "1601525438422287"],
      ["track", "PageView"],
      ["track", "Lead", { empreendimento: "galleria2" }],
    ]);
  });

  it("rejeita respostas de erro ou incompletas do SmartLeads", () => {
    assert.throws(() => parseSuccessfulCaptureResponse('{"success":false}'));
    assert.throws(() => parseSuccessfulCaptureResponse('{"success":true,"leadId":"lead-1"}'));
  });

  it("aceita somente a confirmação completa de criação do SmartLeads", () => {
    assert.deepEqual(
      parseSuccessfulCaptureResponse('{"success":true,"leadId":"lead-1","updateToken":"token-1"}'),
      { success: true, leadId: "lead-1", updateToken: "token-1" },
    );
  });

  it("preserva UTMs e fbclid sem enviá-los ao Pixel", () => {
    installTrackingBrowser(
      "https://carolcunhagalleria2.lovable.app/?utm_source=meta&utm_medium=cpc&utm_campaign=lancamento&utm_content=video&utm_term=apartamento&fbclid=click-1",
    );
    captureUtmParams();
    assert.deepEqual(readUtmParams(), {
      utm_source: "meta",
      utm_medium: "cpc",
      utm_campaign: "lancamento",
      utm_content: "video",
      utm_term: "apartamento",
      fbclid: "click-1",
    });
  });
});
